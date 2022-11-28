import { Injectable } from "src/withXeno/inversify";
import { Demo1Store } from "src/withXeno/stores/Demo1/demo1.store";
import { ElmPositionService } from "../ElmPosition/elmPosition.service";

@Injectable()
export class Demo1Service {
  constructor(
    private demo1Store: Demo1Store,
    private elmPositionService: ElmPositionService
  ) {}

  increase = () => {
    this.demo1Store.increase();
  };

  getAndSetElmPosition = (elmId: string) => {
    const position = this.elmPositionService.getElmPosition(elmId);
    this.demo1Store.setPosition(position);
  };
}
