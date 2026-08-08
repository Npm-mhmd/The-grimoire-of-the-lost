import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
          <div className="text-center max-w-xs px-6">
            <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <span className="text-2xl opacity-60">&#9888;</span>
            </div>
            <p className="font-display text-amber-400 text-lg mb-2">
              Connection Lost
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              The artifact could not be summoned. Please try refreshing the page.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
