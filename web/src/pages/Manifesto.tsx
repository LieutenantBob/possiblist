import { Link } from 'react-router-dom'

// The manifesto is committed content — imported as raw text
// In production this could be fetched, but for v1 we inline the key sections
export function Manifesto() {
  return (
    <div className="max-w-[680px] mx-auto px-4 py-12 md:py-20">
      <h1
        className="font-display font-semibold text-center mb-3"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--deep)', lineHeight: 1.15 }}
      >
        The Possiblist Manifesto
      </h1>
      <p
        className="font-italic italic text-center mb-12"
        style={{ color: 'var(--mist)', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 300 }}
      >
        A founding document for people who would rather be accurate than loud
      </p>

      <div className="article-body" style={{ lineHeight: 1.85, fontSize: '1.05rem' }}>
        <p>Most people are wrong about the state of the world.</p>

        <p>Not wrong in the way that one might reasonably misremember the capital of Myanmar, or underestimate the number of moons orbiting Jupiter by a margin that could be forgiven at a dinner party. Wrong in the specific, spectacular, and frankly impressive way that suggests the entire species has been reading a different newspaper — one that is on fire, published in a language they cannot read, and reporting on a planet they have never actually visited.</p>

        <p>When twelve thousand people across fourteen countries were asked what had happened to global extreme poverty, seventy-four per cent got it wrong. Not approximately wrong. Precisely, confidently, and in many cases passionately wrong, in the direction of the exact opposite of what had occurred. A chimpanzee selecting answers at random would have outperformed them. This is not an insult to chimpanzees. It is an observation about the peculiar lengths to which the human brain will go to maintain a worldview it finds emotionally satisfying, even when that worldview is, by any measurable standard, nonsense.</p>

        <p>This is not because people are stupid. It is, if anything, because people are too clever. They read newspapers. They watch documentaries. They have opinions at dinner. They are well-meaning, well-educated mammals navigating an information environment that was designed not to inform them but to hold their attention for long enough to sell them something — and attention, it turns out, is a commodity most efficiently captured by the sensation that everything is getting worse.</p>

        <p>Fear travels faster than improvement. This has always been true, but the modern media architecture has turbocharged it to a degree that would alarm even the most pessimistic media theorist. A bridge collapse is news. The ten thousand bridges that held up today are not. A disease outbreak makes the front page. The forty-year vaccination campaign that prevented the previous six outbreaks does not. The result is a picture of the world that is vivid, emotionally gripping, and wrong in approximately the way that a map drawn entirely from memory by someone who has only ever seen the world through an aeroplane window would be wrong — recognisably Earth-shaped, but with the continents in surprising locations and several key features missing entirely.</p>

        <p>Some people respond to this by deciding everything is fine. These are the cheerful ones at parties who will explain, at unwanted length, that progress is inevitable and that the market will sort it out. Others respond by deciding everything is catastrophic, and that only their specific brand of radical, urgent, preferably photogenic action can prevent the collapse of civilisation, which they have tentatively scheduled for next Thursday. Still others withdraw entirely, on the reasonable grounds that the whole thing is too complicated, too depressing, and too likely to involve arguing with strangers on the internet.</p>

        <p>None of these starts with the data. All of them end somewhere unhelpful. And all of them, in their different ways, are rather loud.</p>

        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--deep)', margin: '2rem 0' }}>A possiblist starts somewhere else entirely.</p>

        <p>The word was coined by Hans Rosling, a Swedish physician who spent the last decades of his life travelling the world with a box of props and an extraordinary set of charts, gently demonstrating to roomfuls of Nobel laureates, heads of state, and captains of industry that they knew less about the world than a randomly selected chimpanzee. He defined a possiblist as someone who neither hopes without reason nor fears without reason. Someone who constantly resists the overdramatic worldview.</p>

        <p>This is not optimism. Optimism is a mood. A possiblist is not in a mood. A possiblist is reading the data — all of it, not just the comforting parts — and noticing that the data says something considerably more interesting than either "everything is wonderful" or "we are all doomed." It says: progress is real. Problems are real. Both are true at once, often about the same topic, sometimes in the same sentence. The discipline is in holding both simultaneously, which is harder than it sounds and which almost nobody bothers to do, because nuance is not a particularly viral emotion.</p>

        <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--deep)', margin: '2rem 0' }}>
          There are pessimists, who see the glass as half empty. There are optimists, who see it as half full. And then there are possibilists, who remember that it is refillable.
        </p>

        <p>Evidence first, then action. Not the other way around. A possiblist demands data before outrage — not because outrage is never warranted, but because outrage without data is just volume, and volume without direction has never, in the recorded history of shouting, changed anything useful. The calm, rational person is not passive. They are precise. They pick their battles the way a surgeon picks an incision: based on where the intervention will actually help, not on where it will make the most dramatic scar.</p>

        <p>This is not, it should be said, a fringe position. It is not a niche philosophical hobby for people with too many bookshelves. It is, quietly, the way most thoughtful people already think. They read widely. They hold complicated views. They are suspicious of anyone who claims the answer is simple. They know the world is neither a paradise nor a catastrophe. They distrust tribalism but are not above caring deeply. They would like to act but are unwilling to shout.</p>

        <p>They have, until now, had no name for this. No community. No collective voice. The loud get organised — they form movements, write manifestos, march in streets, and dominate the headlines with the serene confidence of people who have confused volume with validity. The calm do not, because organising the calm has always seemed like a contradiction in terms, roughly equivalent to herding cats who have also read Kant.</p>

        <p>But it is not a contradiction. It is an underestimated possibility. The quiet majority deserves a voice as clear as the loud minority's — not louder, but clearer. Not angrier, but more precise. Not more certain, but better informed. And considerably funnier, because if you cannot be amusing about the human condition while examining it, you are probably examining the wrong condition.</p>

        <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--deep)', margin: '2rem 0' }}>So here is what possibilists do.</p>

        <p>They learn the data. Not all of it — no one learns all of it, and anyone who claims to has not understood how much data there is — but enough to know when their instincts are wrong, which turns out to be an unsettling amount of the time. They share what surprises them, because surprise is the sound a prior belief makes when it is being updated, and the updating of prior beliefs is the only known mechanism by which a species that once thought the sun revolved around the Earth has managed to get anything right at all.</p>

        <p>They fund what the evidence shows actually works — not what makes for the most compelling photograph, not what produces the warmest feeling, but what the data, examined with something approaching honesty, suggests will move the number. They act where a small action has real leverage: a dollar, an hour, a conversation, a vote, placed where it will produce a disproportionate return. They form their own positions — individually, based on evidence — and then express them collectively, because individual judgement and collective voice are not opposites. They are, when done properly, collaborators.</p>

        <p>This is not a call to arms. Arms are, on the whole, overrated, and most of the things wrong with the world will not be improved by waving them. It is a call to accuracy. There are no flags here, no slogans, no enemies. There is only the quiet, radical, faintly amusing proposition that we might be wrong about quite a lot — and that being wrong, once you notice it, is the beginning of being less wrong.</p>

        <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--verdigris)', margin: '2.5rem 0', textAlign: 'center' }}>
          That is what a possiblist is. And there are, it turns out, rather more of us than anyone expected.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mt-12 space-y-4">
        <Link
          to="/quiz"
          className="inline-block px-10 py-4 rounded-lg font-body font-semibold no-underline"
          style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '1.1rem' }}
        >
          How wrong are you? →
        </Link>
        <p className="font-mono text-[0.65rem]" style={{ color: 'var(--mist)' }}>
          21 questions. Your worldview may not survive.
        </p>
      </div>
    </div>
  )
}
