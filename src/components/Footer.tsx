import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-navy-700 mt-12 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
          <Link to="/disclaimer" className="hover:text-accent transition-colors">Disclaimer</Link>
          <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          © {new Date().getFullYear()} DevOptimizeBot. One workbench. Every tool you need.
        </p>
      </div>
    </footer>
  )
}
