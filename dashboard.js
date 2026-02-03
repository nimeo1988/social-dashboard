let allSectorsChart, top5SectorsBarChart, goalsPieChart, monthChart, goalsByMonthChart;
let currentData = [];
let filteredData = [];
let currentPage = 1;
const rowsPerPage = 10;

const colors = [
  '#5a8db8','#e74c3c','#e67e22','#7b8794','#3498db','#9b59b6',
  '#27ae60','#f39c12','#c0392b','#16a085','#8e44ad','#2c3e50',
  '#95a5a6','#34495e'
];

// ==========================
// BASE OPTIONS LINE CHART
// ==========================
function baseLineOptions(showLegend = false){
  return {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6,
          color: '#a0a4b8',
          font: { size: 9 }
        },
        grid: { color: '#2d3142' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#a0a4b8',
          font: { size: 10 }
        },
        grid: { color: '#2d3142' }
      }
    },
    plugins: {
      legend: showLegend ? {
        position: 'bottom',
        labels: {
          color: '#c5c7d0',
          font: { size: 9 },
          boxWidth: 10,
          padding: 6
        }
      } : { display: false }
    }
  };
}

// ==========================
// PIE / BAR CHARTS (OK)
// ==========================
function updateSectorsPieChart(data){
  const counts = {};
  data.forEach(r => counts[r.sector] = (counts[r.sector] || 0) + 1);

  if(allSectorsChart) allSectorsChart.destroy();
  allSectorsChart = new Chart(
    document.getElementById('allSectorsChart'),
    {
      type:'doughnut',
      data:{ labels:Object.keys(counts), datasets:[{ data:Object.values(counts), backgroundColor:colors }]},
      options:{ responsive:true, maintainAspectRatio:true }
    }
  );
}

function updateTop5SectorsBarChart(data){
  const counts = {};
  data.forEach(r => counts[r.sector] = (counts[r.sector] || 0) + 1);

  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);

  if(top5SectorsBarChart) top5SectorsBarChart.destroy();
  top5SectorsBarChart = new Chart(
    document.getElementById('top5SectorsBarChart'),
    {
      type:'bar',
      data:{
        labels:sorted.map(s=>s[0]),
        datasets:[{ data:sorted.map(s=>s[1]), backgroundColor:colors }]
      },
      options:{ responsive:true, maintainAspectRatio:true, plugins:{ legend:{ display:false } } }
    }
  );
}

function updateGoalsPieChart(data){
  const counts = {};
  data.forEach(r => counts[r.goal] = (counts[r.goal] || 0) + 1);

  if(goalsPieChart) goalsPieChart.destroy();
  goalsPieChart = new Chart(
    document.getElementById('goalsPieChart'),
    {
      type:'doughnut',
      data:{ labels:Object.keys(counts), datasets:[{ data:Object.values(counts), backgroundColor:colors }]},
      options:{ responsive:true, maintainAspectRatio:true }
    }
  );
}

// ==========================
// LINE CHART: ATTACKS BY MONTH
// ==========================
function updateMonthChart(data){
  const monthCounts = {};
  data.forEach(r=>{
    if(r.date){
      const m = r.date.substring(0,7);
      monthCounts[m] = (monthCounts[m] || 0) + 1;
    }
  });

  const labels = Object.keys(monthCounts).sort();
  const values = labels.map(m=>monthCounts[m]);

  if(monthChart) monthChart.destroy();
  monthChart = new Chart(
    document.getElementById('monthChart'),
    {
      type:'line',
      data:{
        labels,
        datasets:[{
          label:'ATTACKS',
          data:values,
          borderColor:'#5a8db8',
          backgroundColor:'rgba(90,141,184,0.15)',
          fill:true,
          tension:0.4,
          borderWidth:2
        }]
      },
      options: baseLineOptions(false)
    }
  );
}

// ==========================
// LINE CHART: GOALS BY MONTH
// ==========================
function updateGoalsByMonthChart(data){
  const map = {};
  const goals = new Set();

  data.forEach(r=>{
    if(r.date){
      const m = r.date.substring(0,7);
      if(!map[m]) map[m] = {};
      map[m][r.goal] = (map[m][r.goal] || 0) + 1;
      goals.add(r.goal);
    }
  });

  const months = Object.keys(map).sort();
  const datasets = Array.from(goals).map((g,i)=>({
    label:g,
    data:months.map(m=>map[m][g] || 0),
    borderColor:colors[i % colors.length],
    backgroundColor:colors[i % colors.length],
    tension:0.4,
    borderWidth:2,
    fill:false
  }));

  if(goalsByMonthChart) goalsByMonthChart.destroy();
  goalsByMonthChart = new Chart(
    document.getElementById('goalsByMonthChart'),
    {
      type:'line',
      data:{ labels:months, datasets },
      options: baseLineOptions(true)
    }
  );
}

// ==========================
// UPDATE ALL
// ==========================
function updateAllCharts(data){
  updateSectorsPieChart(data);
  updateTop5SectorsBarChart(data);
  updateGoalsPieChart(data);
  updateMonthChart(data);
  updateGoalsByMonthChart(data);
}
