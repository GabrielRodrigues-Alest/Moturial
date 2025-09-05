import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error } as State;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Here we could send to an observability service
    console.error('UI ErrorBoundary caught', { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-semibold mb-2">Algo deu errado</h1>
          <p className="text-muted-foreground">Tente recarregar a página. Se o problema persistir, contate o suporte.</p>
        </div>
      );
    }
    return this.props.children;
  }
}


