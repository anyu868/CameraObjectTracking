import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">应用出现错误</h2>
                <p className="text-gray-300 text-sm">请尝试刷新页面</p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
