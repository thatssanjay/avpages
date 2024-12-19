// Initialize the variables
let teamsData = [];
let duplicateTeams = [];
let ideaCounts = {};
let ideaAllocation = {};
let ideaLimit = 2;

// Handle CSV file upload and processing
document.getElementById('processBtn').addEventListener('click', function() {
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];
  if (!file) return alert('Please upload a CSV file.');

  const reader = new FileReader();
  reader.onload = function(event) {
    const content = event.target.result;
    const lines = content.split('\n').map(line => line.trim());
    const headers = lines[0].split(',');

    // Clear existing data
    teamsData = [];
    duplicateTeams = [];
    ideaCounts = {};
    ideaAllocation = {};

    // Process CSV content
    lines.slice(1).forEach(line => {
      const values = line.split(',');
      if (values.length !== headers.length || values.some(value => value.trim() === '')) return; // Skip invalid rows

      const team = {
        id: values[0].trim(),
        teamName: values[1].trim(),
        idea1: values[2].trim(),
        idea2: values[3].trim(),
        idea3: values[4].trim(),
        completionTime: values[5].trim(),
      };

      teamsData.push(team);

      // Track idea selections
      [team.idea1, team.idea2, team.idea3].forEach(idea => {
        ideaCounts[idea] = (ideaCounts[idea] || 0) + 1;
      });
    });

    // Display data in table
    displayTableData();
    detectDuplicates();
    displayIdeaSelectionCount();
    allocateIdeasToTeams();
  };

  reader.readAsText(file);
});

// Display processed CSV data in table
function displayTableData() {
  const tableBody = document.getElementById('dataTable').querySelector('tbody');
  tableBody.innerHTML = '';
  teamsData.forEach(team => {
    const row = `<tr>
      <td>${team.id}</td>
      <td>${team.teamName}</td>
      <td>${team.idea1}</td>
      <td>${team.idea2}</td>
      <td>${team.idea3}</td>
      <td>${team.completionTime}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });
  document.getElementById('dataTable').style.display = 'table';
}

// Detect duplicate teams and display them
function detectDuplicates() {
  const teamNames = {};
  teamsData.forEach(team => {
    teamNames[team.teamName] = (teamNames[team.teamName] || 0) + 1;
  });

  duplicateTeams = teamsData.filter(team => teamNames[team.teamName] > 1);
  if (duplicateTeams.length > 0) {
    const tableBody = document.getElementById('duplicateTeamsTable').querySelector('tbody');
    tableBody.innerHTML = '';
    duplicateTeams.forEach(team => {
      const row = `<tr class="duplicate-row">
        <td>${team.id}</td>
        <td>${team.teamName}</td>
        <td>${team.idea1}</td>
        <td>${team.idea2}</td>
        <td>${team.idea3}</td>
        <td>${team.completionTime}</td>
      </tr>`;
      tableBody.innerHTML += row;
    });
    document.getElementById('duplicateTeamsTable').style.display = 'table';
  }
}

// Display idea selection count
function displayIdeaSelectionCount() {
  const tableBody = document.getElementById('ideaCountTable').querySelector('tbody');
  tableBody.innerHTML = '';
  const sortedIdeas = Object.entries(ideaCounts).sort((a, b) => b[1] - a[1]);

  sortedIdeas.forEach(([idea, count]) => {
    const rowClass = count === 0 ? 'no-idea' : '';
    const row = `<tr class="${rowClass}">
      <td>${idea}</td>
      <td>${count}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });
  document.getElementById('ideaCountTable').style.display = 'table';
}

// Allocate ideas to teams
function allocateIdeasToTeams() {
  const tableBody = document.getElementById('teamIdeaMapping').querySelector('tbody');
  tableBody.innerHTML = '';
  const allocatedIdeas = {};

  teamsData.forEach(team => {
    const allocatedIdea = findAvailableIdea(team);
    const row = `<tr>
      <td>${team.teamName}</td>
      <td>${allocatedIdea || 'No Idea'}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });

  document.getElementById('teamIdeaMapping').style.display = 'table';
  document.getElementById('exportBtn').style.display = 'inline-block';
}

// Find an available idea for a team
function findAvailableIdea(team) {
  const ideas = [team.idea1, team.idea2, team.idea3];
  for (let i = 0; i < ideas.length; i++) {
    if ((ideaAllocation[ideas[i]] || 0) < ideaLimit) {
      ideaAllocation[ideas[i]] = (ideaAllocation[ideas[i]] || 0) + 1;
      return ideas[i];
    }
  }
  return null;
}

// Export team idea mapping to CSV
document.getElementById('exportBtn').addEventListener('click', function() {
  const rows = [];
  const tableRows = document.getElementById('teamIdeaMapping').querySelectorAll('tr');
  tableRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(cell => cell.innerText);
    rows.push(rowData.join(','));
  });

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'team_idea_mapping.csv';
  link.click();
});
