import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { useTaskContext } from "../context/TaskContext";
import toast from "react-hot-toast";

const HomePage = () => {
  const { logout, user } = useAuth();
  const { addTask, tasks, deleteTask, updateTask } = useTaskContext();

  // console.log("user is",user);
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
      toast.success("Logged out successfully!");
      console.log("User logged out:", user);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout failed:", error);
    }
  };

  // Task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState("Unassigned");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<{
    title: string;
    description: string;
    assignTo: string;
    priority: string;
    status: string;
  } | null>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addTask({
        title,
        description,
        assignTo,
        priority,
        status,
        created: new Date().toLocaleDateString(),
        userId: user?.email ?? "unknown", // associate with user
      });
      toast.success("Task added successfully!");
      setTitle("");
      setDescription("");
      setAssignTo("Unassigned");
      setPriority("Medium");
      setStatus("Pending");
    } catch (error) {
      toast.error("Failed to add task. Please try again.");
      console.error("Add task error:", error);
    }
  };

  const handleDeleteTask = (idx: number) => {
    try {
      const taskToDelete = userTasks[idx];
      if (taskToDelete) {
        deleteTask(taskToDelete);
        toast.success("Task deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete task. Please try again.");
      console.error("Delete task error:", error);
    }
  };

  const handleEditClick = (idx: number) => {
    setEditingIdx(idx);
    setEditTask({ ...tasks[idx] });
  };
// NonNullable is a TypeScript utility type that removes null and undefined from a type.
  const handleEditChange = (field: keyof NonNullable<typeof editTask>, value: string) => {
    if (editTask) setEditTask({ ...editTask, [field]: value });
  };

  const handleEditSave = (idx: number) => {
    try {
      if (editTask) {
        const originalTask = userTasks[idx];
        if (originalTask) {
          updateTask(originalTask, {
            ...originalTask,
            ...editTask,
          });
          toast.success("Task updated successfully!");
        }
        setEditingIdx(null);
        setEditTask(null);
      }
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
      console.error("Edit task error:", error);
    }
  };

  const handleEditCancel = () => {
    setEditingIdx(null);
    setEditTask(null);
  };

  const userTasks = tasks.filter(t => t.userId === user?.email);

  return (
    <div className="bg-linear-to-r from-slate-600 to-blue-200 px-10 ">
      <div className="flex items-center justify-between gap-5 max-w-360 mx-auto py-7  px-2">
        <h1 className="text-2xl font-bold"> Hello {user?.displayName},</h1>
        <div className="flex items-center gap-3">
          {user?.email === "admin@gmail.com" && (
            <Button onClick={() => navigate("/admin")}>Admin</Button>
          )}
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <div>
        <h2 className="text-center text-3xl font-semibold mt-10">Welcome to the Task Manager</h2>
        <p className="text-center mt-4 text-base"> Here you can manage your tasks efficiently.</p>
        

      </div>

      

      <div className="flex flex-col items-center gap-8 pb-10 mt-10">
        {/* Create New Task Card */}
        <Card className="w-full max-w-2xl bg-white/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle>+ Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTask}>
              <div className="grid grid-cols-2 gap-7">
                <div>
                  <Label className="mb-2" htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="description">Description</Label>
                  <Input
                  
                    id="description"
                    placeholder="Enter task description..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                     required
                  />
                </div>
                <div >
                  <Label className="mb-2" htmlFor="assignTo">Assign To</Label>
                  <Select value={assignTo} onValueChange={setAssignTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                      <SelectItem value="Developer1">Developer1</SelectItem>
                      <SelectItem value="Developer2">Developer2</SelectItem>
                      <SelectItem value="Developer3">Developer3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2" htmlFor="priority">Priority *</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low"><div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Low
                          </div></SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            Medium
                          </div>
                      </SelectItem>
                      <SelectItem value="High"><div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            High
                          </div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2" htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pending" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            Pending
                          </div>
                      </SelectItem>
                       <SelectItem value="In Progress"><div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            In Progress
                          </div></SelectItem>
                      <SelectItem value="Completed"> <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Completed
                          </div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardFooter className="mt-6">
                <Button type="submit" className="w-[50%] mx-auto">
                  + Add Task
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        {/* Tasks List Card */}
        <Card className="w-full max-w-360  bg-white/70 backdrop-blur-md ">
          <CardHeader>
            <CardTitle>Tasks ({userTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {userTasks.length === 0 ? (
              <p className="text-center text-gray-500">
                No tasks created yet. Create your first task above!
              </p>
            ) : (
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
                      <th className="py-2 px-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTasks.map((task, idx) => (
                      <tr key={idx} className="border-b last:border-none">
                        {editingIdx === idx ? (
                          <>
                            <td className="py-2 px-4 font-medium">
                              <Input
                                value={editTask?.title ?? ""}
                                onChange={e => handleEditChange("title", e.target.value)}
                                className="h-8"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <Input
                                value={editTask?.description ?? ""}
                                onChange={e => handleEditChange("description", e.target.value)}
                                className="h-8"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <Input
                                value={editTask?.assignTo ?? ""}
                                onChange={e => handleEditChange("assignTo", e.target.value)}
                                className="h-8"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <select
                                value={editTask?.priority ?? ""}
                                onChange={e => handleEditChange("priority", e.target.value)}
                                className="border rounded px-2 py-1 text-xs"
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </select>
                            </td>
                            <td className="py-2 px-4">
                              <select
                                value={editTask?.status ?? ""}
                                onChange={e => handleEditChange("status", e.target.value)}
                                className="border rounded px-2 py-1 text-xs"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td className="py-2 px-4">
                              {new Date().toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="px-2"
                                onClick={() => handleEditSave(idx)}
                              >
                                Save
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="px-2"
                                onClick={handleEditCancel}
                              >
                                Cancel
                              </Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2 px-4 font-medium">{task.title}</td>
                            <td className="py-2 px-4 text-gray-500">{task.description}</td>
                            <td className="py-2 px-4">{task.assignTo}</td>
                            <td className="py-2 px-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  task.priority === "High"
                                    ? "bg-red-100 text-red-700"
                                    : task.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {task.priority.toLowerCase()}
                              </span>
                            </td>
                            <td className="py-2 px-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  task.status === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : task.status === "In Progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {task.status.toLowerCase()}
                              </span>
                            </td>
                            <td className="py-2 px-4">
                              {task.created}
                            </td>
                            <td className="py-2 px-4 flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="p-2"
                                onClick={() => handleEditClick(idx)}
                              >
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                </svg>
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="p-2"
                                onClick={() => handleDeleteTask(idx)}
                              >
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M3 6h18" />
                                  <path d="M8 6v14h8V6" />
                                  <path d="M10 10v6" />
                                  <path d="M14 10v6" />
                                  <path d="M5 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
                                </svg>
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
