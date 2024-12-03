function toggleNav() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('main');
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('shifted');
  }
  