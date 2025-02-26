/* eslint-disable @typescript-eslint/ban-types */
import { Controller, Get } from '@nestjs/common';
import 'reflect-metadata';

// class B {
//   @Property({ name: 'B_a', type: Boolean })
//   a: Boolean;

//   c: String;
// }

// class A {
//   @Property({ name: 'A_propertyA', type: Number })
//   propertyA: Number;

//   @Property({ type: B })
//   b: B;
// }

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    // const mapper = new VlgImportMapper();

    // const data = {
    //   A_propertyA: '1',
    //   B_a: 'true',
    // };

    // const a = mapper.parse(data, A);

    return '';
  }
}
