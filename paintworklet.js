/*
Copyright 2016 Google, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

registerPaint('ripple', class {
    static get inputProperties() { return ['background-color', '--ripple-color', '--animation-tick', '--ripple-x', '--ripple-y']; }
    paint(ctx, geom, properties) {
      const bgColor = properties.get('background-color').cssText;
      const rippleColor = properties.get('--ripple-color').cssText;
      const x = parseFloat(properties.get('--ripple-x').cssText);
      const y = parseFloat(properties.get('--ripple-y').cssText);
      let tick = parseFloat(properties.get('--animation-tick').cssText);
      if(tick < 0)
        tick = 0;
      if(tick > 1000)
        tick = 1000;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, geom.width, geom.height);
      ctx.fillRect(0, 0, geom.width, geom.height);
      ctx.fillStyle = rippleColor;
      ctx.globalAlpha = 1 - tick/1000;
      // console.log('<paintworklet.js> X : ' + x + ' Y : '  + y );

      ctx.arc(
        geom.width/2, geom.height/2,// center
        geom.width * tick/1000, // radius
        0, // startAngle
        2 * Math.PI //endAngle
      );
      ctx.fill();
    }
});
