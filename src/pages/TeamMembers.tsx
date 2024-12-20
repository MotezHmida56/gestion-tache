import DashboardLayout from "@/components/DashboardLayout";
import { SearchBar } from "@/components/SearchBar";
import { UserTable } from "@/components/UserTable";
import { AddMemberDialog } from "@/components/AddMemberDialog";

const TeamMembers = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your team members
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar />
            <AddMemberDialog />
          </div>
        </div>

        <UserTable />
      </div>
    </DashboardLayout>
  );
};

export default TeamMembers;