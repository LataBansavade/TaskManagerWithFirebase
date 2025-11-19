import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Shield,
  Clock,
  AlertCircle,
  Users,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTaskContext } from "../context/TaskContext";

const totalUsers = 3; // Dummy value

const AdminPage = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskContext(); 
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  console.log("All Tasks in AdminPage:", tasks);

  // Filtered tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter: Check if the title or description includes the search query
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());

    // Priority filter: Check if the task matches the selected priority
    const matchesPriority =
      priorityFilter === "" || priorityFilter === "all" || task.priority === priorityFilter;

    // Status filter: Check if the task matches the selected status
    const matchesStatus =
      statusFilter === "" || statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);

  // Get the tasks to display on the current page
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle page navigation
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

 
  return (
    <div className="container mx-auto p-6 space-y-8 bg-linear-to-r from-slate-600 to-blue-200 min-h-dvh ">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-zinc-800" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>
        </div>
        <div>
          <Button onClick={() => navigate("/")}>Home</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/70 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Total Tasks</CardTitle>
            <CheckCircle className="h-5 w-5 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-xs text-zinc-500 mt-1">0 completed</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">In Progress</CardTitle>
            <Clock className="h-5 w-5 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((t) => t.status === "In Progress").length}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Currently active</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">High Priority</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {tasks.filter((t) => t.priority === "High").length}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Needs attention</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Total Users</CardTitle>
            <Users className="h-5 w-5 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <div className="text-xs text-zinc-500 mt-1">Active team members</div>
          </CardContent>
        </Card>
      </div>

      {/* All Tasks Table */}
      <Card className="bg-white/70 backdrop-blur-md">
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <Input
              placeholder="Search all tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex gap-2">
              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-semibold">Title</th>
                  <th className="py-2 px-4 text-left font-semibold">Description</th>
                  <th className="py-2 px-4 text-left font-semibold">Assigned To</th>
                  <th className="py-2 px-4 text-left font-semibold">Priority</th>
                  <th className="py-2 px-4 text-left font-semibold">Status</th>
                  <th className="py-2 px-4 text-left font-semibold">Created At</th>
                  <th className="py-2 px-4 text-left font-semibold">Created By</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  paginatedTasks.map((task, idx) => (
                    <tr key={idx} className="border-b last:border-none">
                      <td className="py-2 px-4 font-medium">{task.title}</td>
                      <td className="py-2 px-4 text-gray-500">{task.description || "No description"}</td>
                      <td className="py-2 px-4">{task.assignTo}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "Medium"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">{task.created}</td>
                      <td className="py-2 px-4">{task.userId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">
              {paginatedTasks.length} of {filteredTasks.length} row(s) displayed.
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">Rows per page</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(v) => {
                  setRowsPerPage(Number(v));
                  setCurrentPage(1); // Reset to the first page when rows per page changes
                }}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="ghost" size="icon" onClick={goToFirstPage} disabled={currentPage === 1}>
                {"<<"}
              </Button>
              <Button variant="ghost" size="icon" onClick={goToPrevPage} disabled={currentPage === 1}>
                {"<"}
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages}>
                {">"}
              </Button>
              <Button variant="ghost" size="icon" onClick={goToLastPage} disabled={currentPage === totalPages}>
                {">>"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
