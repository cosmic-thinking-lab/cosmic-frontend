import { Link } from "react-router-dom";

export default function Hero(): JSX.Element {

  return (
    <section data-hero="" className="hero-section">
      <div className="full-video w-embed">
        <div style={{ width: "100%", height: "100%" }} className="w-background-video w-background-video-atom">
          <video playsInline loop muted autoPlay data-wf-ignore="true" data-object-fit="cover" preload="auto">
            <source src="https://player.vimeo.com/progressive_redirect/playback/1125882576/rendition/1440p/file.mp4?loc=external&signature=a0067ca78212d9ae569da99e8676f4bac2702af80336b7cdf8cef7ce3ef04388" data-wf-ignore="true" />
          </video>
        </div>
      </div>

      <div className="hero-container">
        <div className="hero-flex">
          <h1 className="hero-title" aria-label="Cosmic Thinking Labs Modern Software & Web Solutions">
            <span className="split-word" aria-hidden="true" style={{ "--word": 1 } as React.CSSProperties}>Cosmic</span>{" "}
            <span className="split-word" aria-hidden="true" style={{ "--word": 2 } as React.CSSProperties}>Thinking</span>{" "}
            <span className="split-word" aria-hidden="true" style={{ "--word": 3 } as React.CSSProperties}>Labs</span>{" "}
            <span className="split-word" aria-hidden="true" style={{ "--word": 4 } as React.CSSProperties}>Modern</span>{" "}
            <span className="split-word" aria-hidden="true" style={{ "--word": 5 } as React.CSSProperties}>Software</span>{" "}
            <span className="split-word" aria-hidden="true" style={{ "--word": 6 } as React.CSSProperties}>&</span>{" "}
            <span className="split-word" aria-hidden="true" style={{ "--word": 7 } as React.CSSProperties}>Web</span>{" "}
            <span className="split-word" aria-hidden="true" style={{ "--word": 8 } as React.CSSProperties}>Solutions</span>
          </h1>

        </div>
        <div className="heading-width mt-16">
          <h2 className="heading-6 is-hero">Innovation First.</h2>
          <div className="heading-6 gradient-text">Pioneering world-class</div>
          <div className="heading-6 gradient-text">engineering and design.</div>
        </div>
      </div>
    </section>
  );
}
