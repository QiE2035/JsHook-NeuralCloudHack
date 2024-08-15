declare namespace console {
  function log(...any: any[]): void;
}

declare namespace modmenu {
  type Value = string | number | boolean;

  function create<Args extends Record<keyof Args, Value>>(
    title: string,
    options: {
      type: "switch" | "category" | "input";
      id?: keyof Args;
      title: string;
      val?: Value;
    }[],
    functions: {
      onchange(result: { id: keyof Args; val: Exclude<Value, number> }): void;
    }
  ): modmenu<Args>;
}

declare class modmenu<Args extends Record<keyof Args, modmenu.Value>> {
  close(): void;
  state(): void;
  size(width: number, height: number): void;
  position(type: number, x: number, y: number): void;
  icon(img: string): void;
  edgeHiden(enable: boolean): void;
  update(id: keyof Args, value: modmenu.Value): void;
  closeAll(): void;
}
