import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Innovation } from '@/types';

interface InnovationPreviewProps {
  innovation: Innovation;
}

export function InnovationPreview({ innovation }: InnovationPreviewProps) {
  const faqs = (innovation.faqs as any[]) || [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Innovation Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            This is how your innovation will appear to viewers
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            {innovation.thumbnail_url && (
              <img 
                src={innovation.thumbnail_url} 
                alt="Logo" 
                className="w-16 h-16 rounded-lg border bg-muted object-cover" 
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{innovation.title}</h3>
              <p className="text-sm text-muted-foreground mb-1">{innovation.company_name}</p>
              <p className="text-muted-foreground">{innovation.tagline}</p>
              <div className="flex gap-2 mt-2">
                {innovation.category && <Badge variant="secondary">{innovation.category}</Badge>}
                {innovation.stage && <Badge variant="outline">{innovation.stage}</Badge>}
              </div>
            </div>
          </div>

          {innovation.video_url && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">VIDEO DESCRIPTION</h4>
              <div className="border rounded-lg p-3 bg-muted/50">
                <p className="text-sm">✓ Video uploaded successfully</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {innovation.problem_statement && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">PROBLEM</h4>
                <p className="mt-1">{innovation.problem_statement}</p>
              </div>
            )}
            
            {innovation.solution && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">SOLUTION</h4>
                <p className="mt-1">{innovation.solution}</p>
              </div>
            )}
            
            {innovation.market_size && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">MARKET</h4>
                <p className="mt-1">{innovation.market_size}</p>
              </div>
            )}
            
            {innovation.traction && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">TRACTION</h4>
                <p className="mt-1 whitespace-pre-wrap">{innovation.traction}</p>
              </div>
            )}
            
            {innovation.tags && innovation.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">TAGS</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {innovation.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {faqs.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">FAQs</h4>
                <div className="space-y-3 mt-2">
                  {faqs.map((faq: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <p className="font-medium text-sm">{faq.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {innovation.full_description && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">FULL DESCRIPTION</h4>
                <p className="mt-1 whitespace-pre-wrap">{innovation.full_description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
