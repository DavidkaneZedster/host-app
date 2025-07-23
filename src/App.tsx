import { useEffect, useRef } from 'react';

export default function App() {
  const unmountRef = useRef<() => void | undefined>(undefined);
  const elementId = useRef('microfrontend-container');

  const loadAndRenderMicroFrontend = async () => {
    //@ts-ignore
    const { mount } = await import(/*webpackIgnore: true*/ 'http://localhost:8080/lib.js').then(
      (module) => module,
    );

    // Получаем контейнер
    const container = document.getElementById(elementId.current);
    if (container) {
      unmountRef.current = mount(container);
    }
  };

  useEffect(() => {
    return () => {
      if (unmountRef.current) {
        unmountRef.current();
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Microfrontend Host</h2>
      <button onClick={loadAndRenderMicroFrontend}>Load Microfrontend</button>
      <div
        id={elementId.current}
        style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}
      />
    </div>
  );
}
