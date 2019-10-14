const routeToId = {
  '/about/': 'navabout',
  '/events/': 'navevents',
  '/code/': 'navcode',
  '/blog/': 'navblogpost',
  '/contact/': 'navcontact',
  '/privacy/': 'navprivacy',
}

const setCurrentPage = (pageUrl) => {
  const element = document.getElementById(routeToId[pageUrl]);
  element.classList.add("page-selected");
}

var pageUrl = window.location.pathname;
setCurrentPage(pageUrl);
