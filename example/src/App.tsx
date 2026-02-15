import React from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { initTasks } from "./helper";
import "gantt-task-react/dist/index.css";

const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [isChecked, setIsChecked] = React.useState(true);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isLinkMode, setIsLinkMode] = React.useState(false);
  const [linkSource, setLinkSource] = React.useState<Task | null>(null);

  const [tasks, setTasks] = React.useState<Task[]>(() => {
    const saved = localStorage.getItem("wedding_tasks");
    if (saved) {
      try {
        return JSON.parse(saved).map((t: any) => ({
          ...t,
          start: new Date(t.start),
          end: new Date(t.end)
        }));
      } catch (e) {
        return initTasks();
      }
    }
    return initTasks();
  });

  React.useEffect(() => {
    localStorage.setItem("wedding_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const formatDateWithDay = (date: Date) => {
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}(${dayOfWeek})`;
  };

  // --- ヘッダーの幅を厳密に固定 (合計 400px) ---
  const TaskListHeader: React.FC = () => (
    <div style={{ display: "flex", backgroundColor: "#fbfbfb", borderBottom: "1px solid #e6e4e4", height: 50, alignItems: "center", fontWeight: "bold", fontSize: "13px", color: "#555" }}>
      <div style={{ width: 160, paddingLeft: 10 }}>Name</div>
      <div style={{ width: 120, borderLeft: "1px solid #e6e4e4", textAlign: "center" }}>From</div>
      <div style={{ width: 120, borderLeft: "1px solid #e6e4e4", textAlign: "center" }}>To</div>
    </div>
  );

  // --- データ行の幅をヘッダーと完全に一致させる ---
  const TaskListTable: React.FC<{ tasks: Task[]; selectedTaskId: string }> = ({ tasks, selectedTaskId }) => (
    <div style={{ backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      {tasks.map((t) => (
        <div
          key={t.id}
          onClick={() => handleSelect(t, true)}
          style={{
            height: 50,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "1px solid #f0f0f0",
            backgroundColor: selectedTaskId === t.id ? "#fff9c4" : "transparent",
            transition: "background-color 0.2s"
          }}
        >
          <div style={{ width: 160, minWidth: 160, padding: "0 10px", fontSize: "12px", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {t.name}
          </div>
          <div style={{ width: 120, minWidth: 120, borderLeft: "1px solid #e6e4e4", fontSize: "11px", textAlign: "center", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333" }}>
            {formatDateWithDay(t.start)}
          </div>
          <div style={{ width: 120, minWidth: 120, borderLeft: "1px solid #e6e4e4", fontSize: "11px", textAlign: "center", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333" }}>
            {formatDateWithDay(t.end)}
          </div>
        </div>
      ))}
    </div>
  );

  const handleSelect = (task: Task, isSelected: boolean) => {
    if (isLinkMode && isSelected) {
      if (!linkSource) setLinkSource(task);
      else if (linkSource.id === task.id) setLinkSource(null);
      else {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, dependencies: t.dependencies?.includes(linkSource.id) ? t.dependencies.filter(id => id !== linkSource.id) : [...(t.dependencies || []), linkSource.id] } : t));
        setLinkSource(null);
      }
    } else {
      setSelectedTask(isSelected ? task : null);
    }
  };

  const moveTask = (direction: "up" | "down") => {
    if (!selectedTask) return;
    const currentIndex = tasks.findIndex((t) => t.id === selectedTask.id);
    if (currentIndex === -1) return;
    const newTasks = [...tasks];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= newTasks.length) return;
    [newTasks[currentIndex], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[currentIndex]];
    setTasks(newTasks.map((t, i) => ({ ...t, displayOrder: i + 1 })));
  };

  const handleAddTask = () => {
    const taskName = window.prompt("タスク名を入力してください", "新しいタスク");
    if (!taskName) return;
    setTasks([...tasks, { start: new Date(), end: new Date(new Date().getTime() + 86400000), name: taskName, id: `Task_${Math.random().toString(36).substr(2, 9)}`, type: "task", progress: 0, project: "WeddingProject", displayOrder: tasks.length + 1 }]);
  };

  const handleTaskDelete = (task: Task) => {
    if (window.confirm(`「${task.name}」を削除しますか？`)) {
      setTasks(tasks.filter(t => t.id !== task.id));
      setSelectedTask(null);
    }
    return true;
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher onViewModeChange={setView} onViewListChange={setIsChecked} isChecked={isChecked} />

      <div style={{ margin: "10px 0", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={handleAddTask} style={{ padding: "8px 16px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>＋ 追加</button>
        <button onClick={() => { setIsLinkMode(!isLinkMode); setLinkSource(null); }} style={{ padding: "8px 16px", backgroundColor: isLinkMode ? "#4CAF50" : "#607D8B", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          {isLinkMode ? "📌 リンクモードON" : "🔗 矢印を引く"}
        </button>
        <button onClick={() => selectedTask && handleTaskDelete(selectedTask)} disabled={!selectedTask} style={{ padding: "8px 16px", backgroundColor: selectedTask ? "#FF9800" : "#CCC", color: "white", border: "none", borderRadius: "4px", cursor: selectedTask ? "pointer" : "default" }}>削除</button>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <button onClick={() => moveTask("up")} disabled={!selectedTask} style={{ padding: "2px 8px", fontSize: "10px", cursor: "pointer" }}>▲ 上へ</button>
          <button onClick={() => moveTask("down")} disabled={!selectedTask} style={{ padding: "2px 8px", fontSize: "10px", cursor: "pointer" }}>▼ 下へ</button>
        </div>
        <div style={{ marginLeft: "10px", fontSize: "14px", color: "#444" }}>
          {selectedTask && `選択中: ${selectedTask.name}`}
        </div>
      </div>

      <div style={{ border: "1px solid #ccc", borderRadius: "4px", overflow: "hidden" }}>
        <Gantt
          tasks={tasks}
          viewMode={view}
          onDateChange={(t) => setTasks(tasks.map(old => old.id === t.id ? t : old))}
          onDelete={handleTaskDelete}
          onSelect={handleSelect}
          onDoubleClick={(t) => { const n = window.prompt("名前を変更", t.name); if(n) setTasks(tasks.map(o => o.id === t.id ? {...o, name: n} : o))}}
          listCellWidth={isChecked ? "400px" : ""} // ヘッダーとテーブルの合計幅に合わせる
          columnWidth={view === ViewMode.Day ? 65 : 150}
          locale="ja-JP"
          rowHeight={50}
          TaskListHeader={TaskListHeader}
          TaskListTable={TaskListTable as any}
          barBackgroundSelectedColor="#ff5722"
        />
      </div>
    </div>
  );
};

export default App;