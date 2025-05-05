import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function BouncingDVD() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const logo = new Image();
    logo.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/DVD_logo.svg/1920px-DVD_logo.svg.png';

    const w = 100, h = 50;
    const state = {
      x: canvas.width/2 - w/2,
      y: canvas.height/2 - h/2,
      hue: 0
    };
    const speed = 120;

    const changeHue = () => { state.hue = Math.floor(Math.random()*360); };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1) Draw original black logo
      ctx.drawImage(logo, state.x, state.y, w, h);

      // 2) Recolor via composite
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = `hsl(${state.hue},100%,50%)`;
      ctx.fillRect(state.x, state.y, w, h);

      // 3) Reset blend mode
      ctx.globalCompositeOperation = 'source-over';
    };

    logo.onload = () => {
      const tweenX = gsap.to(state, {
        x: canvas.width - w,
        duration: (canvas.width - w)/speed,
        ease: 'none', repeat: -1, yoyo: true, onRepeat: changeHue
      });
      const tweenY = gsap.to(state, {
        y: canvas.height - h,
        duration: (canvas.height - h)/speed,
        ease: 'none', repeat: -1, yoyo: true, onRepeat: changeHue
      });
      gsap.ticker.add(render);

      return () => {
        tweenX.kill();
        tweenY.kill();
        gsap.ticker.remove(render);
      };
    };

    return () => { gsap.ticker.remove(render); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      style={{ background: '#000', display: 'block', margin: '0 auto' }}
    />
  );
}
