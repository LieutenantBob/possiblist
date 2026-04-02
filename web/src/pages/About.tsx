export function About() {
  return (
    <div className="max-w-[680px] mx-auto px-4 py-12 md:py-20">
      <h1
        className="font-display font-semibold mb-4"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--deep)', lineHeight: 1.15 }}
      >
        About Possiblist<span className="wordmark-degree">°</span>
      </h1>

      <p className="font-italic italic mb-10" style={{ color: 'var(--mist)', fontSize: '1.1rem', fontWeight: 300 }}>
        Neither hoping without reason, nor fearing without reason.
      </p>

      <div className="space-y-6" style={{ lineHeight: 1.85, fontSize: '1.05rem' }}>
        <p className="font-body" style={{ color: 'var(--ink)' }}>
          Possiblist began with a simple observation: most people are confidently
          wrong about the state of the world. Not wrong in small, forgivable ways —
          wrong in the specific direction of too pessimistic. When asked about
          poverty, education, health, and violence, majorities in every surveyed
          country perform worse than random chance. Chimpanzees, as the late Hans
          Rosling was fond of pointing out, would outscore them.
        </p>

        <p className="font-body" style={{ color: 'var(--ink)' }}>
          This is not because people are stupid. It is because the information
          environment is not designed to make them smarter. News reports what is
          new, which means it reports what has gone wrong. Gradual improvement
          — the kind that saves millions of lives per decade — does not produce
          headlines. The result is a systematic gap between what is true and what
          feels true, and that gap has consequences. It affects how we vote, what
          we fear, and whether we believe our own efforts can make a difference.
        </p>

        <p className="font-body" style={{ color: 'var(--ink)' }}>
          Possiblist exists to close that gap. Every question on this site has a
          factual answer, supported by data from the world's most authoritative
          sources — the World Bank, the United Nations, Our World in Data, the
          WHO. Every answer is verified through a three-stage process: primary
          data retrieval, cross-source validation, and nuance review to ensure
          the good news is honest about the bad news that remains.
        </p>

        <p className="font-body" style={{ color: 'var(--ink)' }}>
          The voice you encounter here is deliberately warm. It is influenced
          by Douglas Adams, who understood that the universe is fundamentally
          absurd and that the correct response is amusement rather than despair.
          And by Bill Bryson, who understood that the most surprising facts are
          the ones hiding in plain sight, patiently waiting for someone to notice
          them and say them out loud.
        </p>

        <p className="font-body" style={{ color: 'var(--ink)' }}>
          A possiblist is not an optimist. An optimist believes things will get
          better. A possiblist looks at the evidence, sees that many things have
          gotten better, and asks what we can learn from the ones that did — so
          that we might apply those lessons to the ones that haven't. This is
          harder than optimism and more useful than pessimism. It is, we think,
          the only honest position.
        </p>

        <p className="font-body" style={{ color: 'var(--ink)' }}>
          The word comes from Hans Rosling, the Swedish physician and professor
          of global health who spent the last decades of his life travelling the
          world with a box of props and a set of extraordinary charts, trying to
          convince people that their view of the world was decades out of date.
          He largely succeeded. His book <em>Factfulness</em>, published
          posthumously, became a global bestseller. Bill Gates called it "one
          of the most important books I've ever read."
        </p>

        <p className="font-body" style={{ color: 'var(--ink)' }}>
          We built Possiblist because we believe the work Rosling started is not
          finished. The data has been updated. The misconceptions persist. And
          the gap between what people believe and what is true remains,
          stubbornly, one of the most important problems nobody is talking about.
        </p>
      </div>
    </div>
  )
}
