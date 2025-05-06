import React, { useRef, useEffect, useCallback } from 'react';

export default function BouncingDVD() {
  const canvasRef = useRef(null);
  const logoImage = useRef(new Image()).current;

  const w = 100, h = 50;
  const baseSpeed = 120;

  const logosRef = useRef([]);

  const tick = (timestamp) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    logosRef.current.forEach(logo => {
      if (logo.lastTime == null) logo.lastTime = timestamp;
      const dt = (timestamp - logo.lastTime) / 1000;
      logo.lastTime = timestamp;

      logo.x += logo.vx * dt;
      logo.y += logo.vy * dt;

      if (logo.x <= 0) {
        logo.x = 0;
        logo.vx *= -1;
        logo.hue = Math.floor(Math.random() * 360);
      } else if (logo.x + w >= canvas.width) {
        logo.x = canvas.width - w;
        logo.vx *= -1;
        logo.hue = Math.floor(Math.random() * 360);
      }

      if (logo.y <= 0) {
        logo.y = 0;
        logo.vy *= -1;
        logo.hue = Math.floor(Math.random() * 360);
      } else if (logo.y + h >= canvas.height) {
        logo.y = canvas.height - h;
        logo.vy *= -1;
        logo.hue = Math.floor(Math.random() * 360);
      }

      ctx.drawImage(logoImage, logo.x, logo.y, w, h);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = `hsl(${logo.hue},100%,50%)`;
      ctx.fillRect(logo.x, logo.y, w, h);
      ctx.globalCompositeOperation = 'source-over';
    });

    requestAnimationFrame(tick);
  };

  const addLogo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x0 = Math.random() * (canvas.width - w);
    const y0 = Math.random() * (canvas.height - h);
    const angle = Math.random() * Math.PI * 2;
    logosRef.current.push({
      x: x0,
      y: y0,
      vx: Math.cos(angle) * baseSpeed,
      vy: Math.sin(angle) * baseSpeed,
      hue: Math.floor(Math.random() * 360),
      lastTime: null,
    });
  }, [baseSpeed]);

  const removeLogo = useCallback(() => {
    logosRef.current.pop();
  }, []);

  useEffect(() => {
    logoImage.src =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/DVD_logo.svg/1920px-DVD_logo.svg.png';
    const onload = () => {
      requestAnimationFrame(tick);
      addLogo();
    };
    logoImage.addEventListener('load', onload);
    return () => {
      logoImage.removeEventListener('load', onload);
    };
  }, [logoImage, tick, addLogo]);

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={addLogo}
        style={{ margin: '1em', padding: '0.5em 1em', fontSize: '1rem', cursor: 'pointer' }}
      >
        Add DVD Logo
      </button>
      <button
        onClick={removeLogo}
        style={{ margin: '1em', padding: '0.5em 1em', fontSize: '1rem', cursor: 'pointer' }}
      >
        Remove DVD Logo
      </button>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ background: '#000', display: 'block', margin: '0 auto' }}
      />
    </div>
  );
}
