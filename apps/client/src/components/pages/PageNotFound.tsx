import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export const PageNotFound = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        {/* Visual 404 Header */}
        <h1 className="text-9xl font-black text-muted-foreground/30 select-none tracking-widest">
          404
        </h1>
        
        <h2 className="mt-4 text-base text-muted-foreground sm:text-4xl">
          Page not found
        </h2>
        
        <p className="mt-4 text-base text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has moved.
        </p>

        {/* Action Buttons using shadcn components */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
