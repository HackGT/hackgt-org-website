const routeToId = {
  '/about/': 'navabout',
  '/events/': 'navevents',
  '/code/': 'navcode',
  '/blog/': 'navblogpost',
  '/contact/': 'navcontact'
}

const setCurrentPage = (pageUrl) => {
  // get the path
  // pass it to getElementById
  // add the class to it
  const element = document.getElementById(routeToId[pageUrl]);
  element.classList.add("page-selected");
  // REMVOVE THIS CODE
  // var currentPage = document.getElementById('navabout');
  // currentPage.style.fontWeight = 'bold';
  // currentPage.style.color = 'white';
}
