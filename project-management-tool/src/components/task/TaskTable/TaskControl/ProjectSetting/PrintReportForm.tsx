import React, { useContext } from 'react';
import { ProjectContext } from '../../TaskTable';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function PrintReport() {
  const { project } = useContext(ProjectContext);

  const formatLogAction = (action: string) => {
    // Nếu action chứa JSON string, chỉ lấy hành động chính
    if (action.includes('update task')) {
      return 'update task';
    }
    return action.length > 30 ? action.substring(0, 30) + '...' : action;
  };

  const handleExportPDF = () => {
    if (!project) return;

    const doc = new jsPDF();
    let yPos = 15;
    
    // Title
    doc.setFontSize(20);
    doc.text('Project Report', 105, yPos, { align: 'center' });
    yPos += 10;
    
    // Project Info
    doc.setFontSize(12);
    doc.text('Project Information', 14, yPos);
    yPos += 5;
    
    const projectInfo = [
      ['Name:', project.name],
      ['Description:', project.description || 'No description'],
      ['Status:', project.state === 0 ? 'In Progress' : project.state === 1 ? 'Closed' : 'Completed'],
      ['Created At:', formatDate(project.createdAt)],
      ['Members:', project.member.length.toString()],
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [],
      body: projectInfo,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 30 } },
      margin: { left: 14 },
      didDrawPage: (data) => {
        yPos = data.cursor?.y ? data.cursor.y + 10 : yPos + 10;
      },
    });

    // Task Statistics
    const allTasks = project.list.flatMap(list => list.list);
    const completedTasks = allTasks.filter(task => task.status);
    const incompleteTasks = allTasks.filter(task => !task.status);
    const completionRate = allTasks.length > 0 
      ? ((completedTasks.length / allTasks.length) * 100).toFixed(1)
      : '0';

    doc.text('Task Statistics', 14, yPos);
    yPos += 5;
    
    const taskStats = [
      ['Total Tasks:', allTasks.length.toString()],
      ['Completed Tasks:', completedTasks.length.toString()],
      ['Incomplete Tasks:', incompleteTasks.length.toString()],
      ['Completion Rate:', `${completionRate}%`],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: taskStats,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 30 } },
      margin: { left: 14 },
      didDrawPage: (data) => {
        yPos = data.cursor?.y ? data.cursor.y + 10 : yPos + 10;
      },
    });

    // Completed Tasks
    doc.text('Completed Tasks', 14, yPos);
    yPos += 5;
    
    const completedTasksData = completedTasks.map(task => [
      task.name.length > 30 ? task.name.substring(0, 30) + '...' : task.name,
      project.member.filter(m => task.member.includes(m._id)).map(m => m.username).join(', ') || 'Unassigned',
      formatDate(task.createdAt),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Task Name', 'Assigned To', 'Completion Date']],
      body: completedTasksData,
      theme: 'striped',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [75, 75, 75] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 }
      },
      margin: { left: 14 },
      didDrawPage: (data) => {
        yPos = data.cursor?.y ? data.cursor.y + 10 : yPos + 10;
      },
    });

    // Incomplete Tasks
    doc.text('Incomplete Tasks', 14, yPos);
    yPos += 5;
    
    const incompleteTasksData = incompleteTasks.map(task => [
      task.name.length > 30 ? task.name.substring(0, 30) + '...' : task.name,
      project.member.filter(m => task.member.includes(m._id)).map(m => m.username).join(', ') || 'Unassigned',
      task.due ? formatDate(task.due) : 'No deadline',
      task.priority.toString(),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Task Name', 'Assigned To', 'Deadline', 'Priority']],
      body: incompleteTasksData,
      theme: 'striped',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [75, 75, 75] },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20 }
      },
      margin: { left: 14 },
      didDrawPage: (data) => {
        yPos = data.cursor?.y ? data.cursor.y + 10 : yPos + 10;
      },
    });

    // Project Logs
    if (project.log && project.log.length > 0) {
      doc.text('Project Activity Log', 14, yPos);
      yPos += 5;
      
      const logData = project.log.map(log => [
        formatDate(log.createdAt),
        log.email,
        formatLogAction(log.action),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'User', 'Action']],
        body: logData,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [75, 75, 75] },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 60 },
          2: { cellWidth: 60 }
        },
        margin: { left: 14 },
      });
    }

    // Save PDF
    doc.save(`${project.name}-report.pdf`);
  };

  return (
    <div className="p-4">
      <Button onClick={handleExportPDF} className="w-full flex items-center justify-center gap-2">
        <Download size={16} />
        Export Project Report
      </Button>
    </div>
  );
}
