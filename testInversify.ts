import "reflect-metadata";
import { Container, injectable } from "inversify";

const CLASS_SYMBOL = Symbol("classSymbol");
export const container = new Container();

const USE_SYMBOL_AS_IDENTIFIER = false;
export type ClassLike<T> = new (...args: any[]) => T;

type InjectableConfig = {
  name?: string;
  singleton?: boolean;
};
export const Injectable = (
  { name, singleton }: InjectableConfig = {
    name: undefined,
    singleton: undefined,
  }
) => {
  return (target: ClassLike<any>) => {
    const res = injectable()(target);
    let classIdentifier = USE_SYMBOL_AS_IDENTIFIER
      ? Symbol.for(target.name)
      : target;
    if (typeof name !== "undefined" && USE_SYMBOL_AS_IDENTIFIER) {
      classIdentifier = Symbol(name);
      Reflect.defineMetadata(CLASS_SYMBOL, classIdentifier, target);
    }
    const bind = container.bind<typeof target>(classIdentifier).to(target);
    if (singleton) bind.inSingletonScope();

    return res;
  };
};

const getClassSymbol = (target: ClassLike<any>) => {
  if (!USE_SYMBOL_AS_IDENTIFIER) return target;
  const storedSymbol = Reflect.getMetadata(CLASS_SYMBOL, target);
  return storedSymbol ?? Symbol.for(target.name);
};

export const resolve = <T extends any>(target: ClassLike<T>): T => {
  const paramTypes = Reflect.getMetadata("design:paramtypes", target);
  const identifier = getClassSymbol(target);
  if (!paramTypes?.length) {
    if (container.isBound(identifier)) {
      return container.get(identifier);
    }
    return new target();
  }
  const args: any[] = (paramTypes as any[]).map(resolve);
  return new target(...args);
};

export const Instantiable = () => {
  return (target: ClassLike<any>) => {
    return Injectable()(target);
  };
};