import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BranchData } from "@/schemas/branch-schema";
import { Plus } from "lucide-react";

interface BranchListProps {
  branches: BranchData[];
}

export const BranchList = ({ branches }: BranchListProps) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filiais</CardTitle>
          <Button>
            <Plus className="h-4 w-4" />
            Nova Filial
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {branches && branches.length > 0 ? (
          <div className="space-y-4">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div>
                  <p className="font-semibold">{branch.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {branch.city}, {branch.state}
                  </p>
                </div>
                <Button variant="outline">Editar</Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-3">
            <p>Nenhuma filial cadastrada.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
