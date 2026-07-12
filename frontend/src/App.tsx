import { useTheme } from './context/ThemeContext.tsx'

function App() {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--brand-canvas-soft)', color: 'var(--brand-ink)' }}>
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-12">
        <h1
          className="font-semibold"
          style={{
            fontSize: 'var(--text-heading-1)',
            letterSpacing: 'var(--tracking-heading-1)',
            lineHeight: 'var(--leading-heading-1)',
          }}
        >
          TransitOps
        </h1>
        <button
          type="button"
          onClick={toggleTheme}
          className="px-4 py-1 text-sm font-medium rounded-full transition-transform active:scale-90"
          style={{
            backgroundColor: 'var(--brand-surface)',
            color: 'var(--brand-ink)',
            border: '1px solid var(--brand-hairline)',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {resolvedTheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <section
          className="p-6"
          style={{
            backgroundColor: 'var(--brand-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--brand-hairline)',
          }}
        >
          <p
            className="mb-4"
            style={{
              fontSize: 'var(--text-body-md)',
              lineHeight: 'var(--leading-body-md)',
              color: 'var(--brand-ink-secondary)',
            }}
          >
            This is a minimal shell to test the dark mode design
            tokens. No shadcn components have been added yet.
          </p>

          <div
            className="inline-block px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: 'var(--brand-surface)',
              color: 'var(--brand-primary)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            badge-pill
          </div>
        </section>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ColorSwatch label="Primary" token="var(--brand-primary)" />
          <ColorSwatch label="Secondary" token="var(--brand-secondary)" />
          <ColorSwatch label="Canvas" token="var(--brand-canvas)" />
          <ColorSwatch label="Surface" token="var(--brand-surface)" />
          <ColorSwatch label="Ink" token="var(--brand-ink)" />
          <ColorSwatch label="Muted" token="var(--brand-ink-muted)" />
          <ColorSwatch label="Faint" token="var(--brand-ink-faint)" />
          <ColorSwatch label="Hairline" token="var(--brand-hairline)" />
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          <ColorSwatch label="Sky" token="var(--brand-accent-sky)" />
          <ColorSwatch label="Purple" token="var(--brand-accent-purple)" />
          <ColorSwatch label="Pink" token="var(--brand-accent-pink)" />
          <ColorSwatch label="Orange" token="var(--brand-accent-orange)" />
          <ColorSwatch label="Teal" token="var(--brand-accent-teal)" />
          <ColorSwatch label="Green" token="var(--brand-accent-green)" />
          <ColorSwatch label="Brown" token="var(--brand-accent-brown)" />
          <ColorSwatch label="Deep Purple" token="var(--brand-accent-purple-deep)" />
        </div>
      </main>
    </div>
  )
}

function ColorSwatch({ label, token }: { label: string; token: string }) {
  return (
    <div
      className="p-3 text-center text-xs font-medium"
      style={{
        backgroundColor: 'var(--brand-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--brand-hairline)',
        color: 'var(--brand-ink-secondary)',
      }}
    >
      <div
        className="w-full h-10 mb-2 rounded"
        style={{ backgroundColor: token }}
      />
      {label}
    </div>
  )
}

export default App
