import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { UserTable } from "@/components/UserTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your user base here
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar />
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </div>
          </div>
          <UserTable />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;