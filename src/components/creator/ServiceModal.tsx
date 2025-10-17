import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, X, Calendar } from "lucide-react";

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: any;
  onSave: () => void;
  creatorId: string;
}

export function ServiceModal({ open, onOpenChange, service, onSave, creatorId }: ServiceModalProps) {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [formData, setFormData] = useState({
    title: "",
    scope: [] as string[],
    price: "",
    delivery_days: "",
    offersEquity: false,
    offersCommission: false,
  });
  const [currentScopeItem, setCurrentScopeItem] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) {
      const scopeArray = service.description ? service.description.split('\n').filter((item: string) => item.trim()) : [];
      setFormData({
        title: service.title || "",
        scope: scopeArray,
        price: service.price?.toString() || "",
        delivery_days: service.delivery_days?.toString() || "",
        offersEquity: service.offers_equity || false,
        offersCommission: service.offers_commission || false,
      });
    } else {
      setFormData({
        title: "",
        scope: [],
        price: "",
        delivery_days: "",
        offersEquity: false,
        offersCommission: false,
      });
    }
    setCurrentScopeItem("");
  }, [service, open]);

  const addScopeItem = () => {
    if (currentScopeItem.trim() && !formData.scope.includes(currentScopeItem.trim())) {
      setFormData(prev => ({
        ...prev,
        scope: [...prev.scope, currentScopeItem.trim()]
      }));
      setCurrentScopeItem("");
    }
  };

  const removeScopeItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      scope: prev.scope.filter(s => s !== item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (formData.scope.length === 0) {
        toast.error("Please add at least one item to 'What's included'");
        setSaving(false);
        return;
      }

      const serviceData = {
        title: formData.title,
        description: formData.scope.join('\n'),
        price: parseFloat(formData.price),
        delivery_days: parseInt(formData.delivery_days),
        offers_equity: formData.offersEquity,
        offers_commission: formData.offersCommission,
        creator_id: creatorId,
      };

      if (service) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', service.id);

        if (error) throw error;
        toast.success("Service updated successfully");
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert(serviceData);

        if (error) throw error;
        toast.success("Service created successfully");
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;
      toast.success("Service deleted successfully");
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Failed to delete service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add Service"}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={viewMode === "edit" ? "default" : "outline"}
            onClick={() => setViewMode("edit")}
            className="flex-1"
          >
            Edit service
          </Button>
          <Button
            type="button"
            variant={viewMode === "preview" ? "default" : "outline"}
            onClick={() => setViewMode("preview")}
            className="flex-1"
          >
            Preview service
          </Button>
        </div>

        {viewMode === "preview" ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-2">
                  {formData.title || "Service Title"}
                </h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  {formData.delivery_days && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formData.delivery_days} days
                    </div>
                  )}
                  {formData.price && (
                    <div className="text-lg font-semibold text-foreground">
                      ${parseFloat(formData.price).toLocaleString()}
                    </div>
                  )}
                </div>
                {formData.scope.length > 0 ? (
                  <ul className="space-y-2 mb-3">
                    {formData.scope.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground mb-3">
                    No items added yet. Switch to Edit mode to add what's included.
                  </p>
                )}
                {(formData.offersEquity || formData.offersCommission) && (
                  <div className="flex gap-2">
                    {formData.offersEquity && (
                      <Badge variant="secondary" className="text-xs">
                        also accepts equity-based pay
                      </Badge>
                    )}
                    {formData.offersCommission && (
                      <Badge variant="secondary" className="text-xs">
                        also accepts commission-based pay
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Pitch Deck Design"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery_days">Duration (days)</Label>
              <Input
                id="delivery_days"
                type="number"
                value={formData.delivery_days}
                onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                placeholder="7"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="mb-2 block">What's included</Label>
            {formData.scope.length > 0 && (
              <div className="space-y-1 mb-2">
                {formData.scope.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-muted px-3 py-2 rounded">
                    <span>• {item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => removeScopeItem(item)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input 
                value={currentScopeItem} 
                onChange={(e) => setCurrentScopeItem(e.target.value)}
                placeholder="e.g., Complete 12-15 slide pitch deck design"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addScopeItem();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addScopeItem}
                disabled={!currentScopeItem.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <Label>Also available for:</Label>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="service-equity"
                checked={formData.offersEquity}
                onChange={(e) => setFormData({ ...formData, offersEquity: e.target.checked })}
                className="cursor-pointer"
              />
              <label htmlFor="service-equity" className="text-sm cursor-pointer">Equity-based</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="service-commission"
                checked={formData.offersCommission}
                onChange={(e) => setFormData({ ...formData, offersCommission: e.target.checked })}
                className="cursor-pointer"
              />
              <label htmlFor="service-commission" className="text-sm cursor-pointer">Commission-based</label>
            </div>
          </div>

            <div className="flex gap-3 justify-between pt-4">
              {service && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Delete Service
                </Button>
              )}
              <div className="flex gap-3 ml-auto">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Service"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
