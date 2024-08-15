import "frida-il2cpp-bridge";

const args = {
  damage_reduction: false,
  miss: false,
  reduction_factor: 0.3,
  damage_increase: false,
  increase_factor: 1.5,
};

const ENABLE = "开启";

modmenu.create<typeof args>(
  "云图计划",
  [
    {
      type: "category",
      title: "减伤",
    },
    {
      type: "switch",
      id: "damage_reduction",
      title: ENABLE,
      val: args.damage_reduction,
    },
    {
      type: "switch",
      id: "miss",
      title: "闪避",
      val: args.miss,
    },
    {
      type: "input",
      title: "比例",
      id: "reduction_factor",
      val: args.reduction_factor,
    },
    {
      type: "category",
      title: "增伤",
    },
    {
      type: "switch",
      id: "damage_increase",
      title: ENABLE,
      val: args.damage_increase,
    },
    {
      type: "input",
      title: "比例",
      id: "increase_factor",
      val: args.increase_factor,
    },
  ],
  {
    onchange(result) {
      switch (result.id) {
        case "damage_reduction":
          args.damage_reduction = result.val as boolean;
          break;
        case "miss":
          args.miss = result.val as boolean;
          break;
        case "reduction_factor":
          args.reduction_factor = parseFloat(result.val as string);
          break;
        case "damage_increase":
          args.damage_increase = result.val as boolean;
          break;
        case "increase_factor":
          args.increase_factor = parseFloat(result.val as string);
          break;
      }
    },
  }
);

enum eHurtHealType {
  None,
  NormalHurt,
  Heal,
  Skill,
  Crit = 4,
  Miss = 6,
  DmgAbsorptio = 7,
  HealCrit = 9,
  ShieldDmg,
  AddShield = 11,
  ReturnDmg = 13,
  SubDmg,
}

enum Belong {
  neutral,
  player,
  enemy,
  ally,
}

type BattleRoleEntity = Il2Cpp.Object;
type BattleSkill = Il2Cpp.Object;

Il2Cpp.perform(() => {
  const methodGetDamage = Il2Cpp.domain
    .assembly("Assembly-CSharp")
    // .image.class("BattleRealRoleEntity")
    .image.class("BattleCharacterEntity")
    .method("GetDamage");

  const getBelongNum = (entity: BattleRoleEntity) =>
    entity.method<Belong>("get_belongNum").invoke();

  // const getBelong = (entity: BattleRoleEntity) =>
  //   entity
  //     .method<Il2Cpp.ValueType>("get_belong")
  //     .invoke()
  //     .box()
  //     .field<Belong>("value__").value;

  // System.Int32 GetDamage(
  //   System.Int32     damage,
  //   System.Int32     shieldCostDmg,
  //   eHurtHealType    hurtHealType,
  //   BattleRoleEntity sender,
  //   BattleSkill      skill,
  //   System.Int32     hurtType,
  //   System.Boolean   isShowText
  // );
  // @ts-ignore
  methodGetDamage.implementation = function (
    damage: number,
    shieldCostDmg: number,
    hurtHealType: eHurtHealType,
    sender: BattleRoleEntity,
    skill: BattleSkill,
    hurtType: number,
    isShowText: boolean
  ): number {
    const from = getBelongNum(sender);
    const to = getBelongNum(this as BattleRoleEntity);

    if (args.damage_reduction && to === Belong.player) {
      damage *= args.reduction_factor;
      if (args.miss || damage <= 0) {
        damage = 0;
        hurtHealType = eHurtHealType.Miss;
      }
    }

    if (args.increase_factor && from === Belong.player) {
      damage *= args.increase_factor;
    }

    return this.method<number>("GetDamage").invoke(
      damage,
      shieldCostDmg,
      hurtHealType,
      sender,
      skill,
      hurtType,
      isShowText
    );
  };
});
