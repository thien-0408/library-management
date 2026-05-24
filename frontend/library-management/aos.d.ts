declare module 'aos' {
  type AOSOptions = {
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    offset?: number;
  };

  const AOS: {
    init: (options?: AOSOptions) => void;
    refreshHard: () => void;
  };

  export default AOS;
}
