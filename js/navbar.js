const routeToId = {
  '/about/': 'navabout',
  '/events/': 'navevents',
  '/code/': 'navcode',
  '/blog/': 'navblogpost',
  '/privacy/': 'navprivacy',
  '/hackgt7/': 'navhackgt7',
  '/contact/': 'navcontact',
}

const setCurrentPage = (pageUrl) => {
  const element = document.getElementById(routeToId[pageUrl]);
  element.classList.add("page-selected");
}

var pageUrl = window.location.pathname;
setCurrentPage(pageUrl);
