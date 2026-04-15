import { useData } from "@/lib/DataContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const QueryLogPage = () => {
  const { queryLogs } = useData();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">SQL Query Log</h1>
          <p className="text-muted-foreground">All CRUD operations are logged as MySQL-style queries</p>
        </div>

        {queryLogs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No queries executed yet. Go to any table and perform INSERT, UPDATE, or DELETE operations.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{queryLogs.length} queries logged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                {queryLogs.map((q) => (
                  <div key={q.id} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
                    <Badge
                      variant={
                        q.type === "INSERT" ? "default"
                        : q.type === "DELETE" ? "destructive"
                        : q.type === "UPDATE" ? "secondary"
                        : "outline"
                      }
                      className="shrink-0 text-xs"
                    >
                      {q.type}
                    </Badge>
                    <div className="flex-1">
                      <code className="text-foreground break-all">{q.query}</code>
                      <p className="text-xs text-muted-foreground mt-1">{q.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default QueryLogPage;
