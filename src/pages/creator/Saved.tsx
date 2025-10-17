import { useState } from "react";
import { Bookmark, Filter, Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/creator/ui/card";
import { Button } from "@/components/creator/ui/button";
import { Input } from "@/components/creator/ui/input";
import { Badge } from "@/components/creator/ui/badge";
import { savedItems, categories } from "@/lib/creator/creatorData";
import type { SavedItem } from "@/lib/creator/types";

export default function Saved() {
  const [items, setItems] = useState(savedItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = items.filter(item => 
    (selectedCategory === "all" || item.category === selectedCategory) &&
    (searchQuery === "" || item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleOfferHelp = (item: SavedItem) => {
    // Navigate to proposal composer for this brief
    console.log("Offer help for:", item.briefId);
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saved Items</h1>
          <p className="text-muted-foreground">{items.length} items saved</p>
        </div>
        <Bookmark className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button size="icon" variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Saved Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <div 
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.thumbnail})` }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-3 right-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-black/50 text-white hover:bg-black/70"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>${item.budget}</span>
                <span>{item.timeline}</span>
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                Saved {new Date(item.savedAt).toLocaleDateString()}
              </p>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleOfferHelp(item)}>
                  Offer Help
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No saved items found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your filters"
                : "Save interesting projects to access them later"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}