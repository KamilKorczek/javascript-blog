'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};

const opts = {
  tagSizes: {
    count: 6,
    classPrefix: 'tag-size-',
  },
};
const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    title: '.post-title',
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.list.tags',
    authors: '.list.authors',
  },
};

/* const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.list.tags',
  optAuthorsListSelector = '.list.authors',
  optCloudClassCount = 6,
  optCloudClassPrefix = 'tag-size-'; */

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  //console.log('Link was clicked!');
  //console.log('clickedElement (with plus): ' + clickedElement);
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll(select.all.articles);

  for (let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  //console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  //console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

const links = document.querySelectorAll('.titles a');

for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}

function generateTitleLinks(customSelector = '') {

  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);

  titleList.innerHTML = '';

  /* [DONE] find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(select.all.articles + customSelector);

  //console.log('customSelector', customSelector);
  //console.log(select.all.articles + customSelector);

  let html = '';

  for (let article of articles) {

    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');

    /* [DONE] find the title element */
    const articleTitle = article.querySelector(select.article.title).innerHTML;

    /* [DONE IN PREVIOUS LINE] get the title from the title element */

    /* [DONE] create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    //console.log('linkHTML', linkHTML);

    /* [DONE] insert link into titleList */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  //console.log('links', links);
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {

  const params = {
    min: 999999,
    max: 0,
  };

  for(let tag in tags) {
    if(tags[tag] > params.max) {
      params.max = tags[tag];
    }

    if(tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass (count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1 );

  return opts.tagSizes.classPrefix + classNumber;

}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  //console.log(allTags);
  /* [DONE] find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  //console.log(articles);
  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {
    //console.log(article);
    /* [DONE] find tags wrapper */
    const tagList = article.querySelector(select.article.tags);
    //console.log(article, tagList);
    /* [DONE] make html variable with empty string */
    let html = '';
    //console.log(html);
    /* [DONE] get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    //console.log(articleTags);

    /* [DONE] split tags into array */
    const articleTagsArray = articleTags.split(' ');
    //console.log(articleTagsArray);

    /* [DONE] START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      //console.log(tag);

      /* [DONE] generate HTML of the link */
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      //console.log(linkHTML);

      /* [DONE] add generated code to html variable */
      html = html + ' ' + linkHTML;
      //console.log(html);
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)) {
        //console.log(!allTags.hasOwnProperty(tag));
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
        //console.log(tag);
      } else {
        allTags[tag]++;
        //console.log(allTags);
      }

    /* [DONE] END LOOP: for each tag */
    }

    /* [DONE] insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
    //console.log(tagList);
  /* [DONE] END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);
  //console.log(tagList);

  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
  //console.log(allTagsHTML);

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags) {
    //console.log(allTags);

    /*const LinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag +
                       '</a></li>'; <span> (' + allTags[tag] + ') </span>*/
    //console.log(LinkHTML);

    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    //console.log(allTagsData.tags);
    //console.log(allTagsHTML);

  /* [NEW] END LOOP: for each tag in allTags: */
  }

  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  //console.log(allTagsData);

}

generateTags();

function tagClickHandler(event) {
  /* [DONE] prevent default action for this event */
  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* [DONE] find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* [DONE] START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {

    /* [DONE] remove class active */
    activeTagLink.classList.remove('active');

  /* [DONE] END LOOP: for each active tag link */
  }

  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {

    /* [DONE] add class active */
    tagLink.classList.add('active');

  /* [DONE] END LOOP: for each found tag link */
  }

  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');

}

function addClickListenersToTags() {
  /* [DONE] find all links to tags */
  const tagLinks = document.querySelectorAll(select.all.linksTo.tags);

  /* [DONE] START LOOP: for each link */
  for (let tagLink of tagLinks) {

    /* [DONE] add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);

  /* [DONE] END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};

  /* [DONE] find all articles */
  const articles = document.querySelectorAll(select.all.articles);

  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {

    /* [DONE] find author wrapper */
    const authorsName = article.querySelector(select.article.author);
    //console.log(authorsName);

    /* [DONE] make html variable with empty string */
    let html = '';

    /* [DONE] get author from data-author attribute */
    const author = article.getAttribute('data-author');
    //console.log(author);

    /* [DONE] generate HTML of the link */
    const authorLinkHTMLData = {author: author};
    const authorLinkHTML = templates.authorLink(authorLinkHTMLData);
    //console.log(authorLinkHTML);

    /* [DONE] add generated code to html variable */
    html = html + ' ' + authorLinkHTML;
    //console.log(html);

    /* [NEW] check if this link is NOT already in allTags */
    if(!allAuthors.hasOwnProperty(author)) {
      //console.log(!allAuthors.hasOwnProperty(author));
      /* [NEW] add author to allAuthors object */
      allAuthors[author] = 1;
      //console.log(author);
    } else {
      allAuthors[author]++;
      //console.log(allAuthors);
    }

    /* [DONE] insert HTML of all the links into the author wrapper */
    authorsName.innerHTML = html;

    /* [DONE] END LOOP: for every article: */
  }
  /* [NEW] find list of authors in right column */
  const authorsName = document.querySelector(select.listOf.authors);
  //console.log(authorsName);

  const tagsParams = calculateTagsParams(allAuthors);
  //console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  const allAuthorsData = {authors: []};
  //console.log(allAuthorsHTML);

  /* [NEW] START LOOP: for each author in allAuthors: */
  for(let author in allAuthors) {
    //console.log(allAuthors);

    /*const authorLinkHTML = '<li><a class="' + calculateTagClass(allAuthors[author], tagsParams) + '" href="#author-' + author + '">' + author +
                             '</a></li>'; <span> (' + allTags[tag] + ') </span>*/
    //console.log(authorLinkHTML);

    /* [NEW] generate code of a link and add it to allTagsHTML */
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      className: calculateTagClass(allAuthors[author], tagsParams)
    });
    //console.log(allAuthorsHTML);

  /* [NEW] END LOOP: for each author in allAuthors: */
  }

  /* [NEW] add html from allAuthorsHTML to authorName */
  authorsName.innerHTML = templates.authorCloudLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event) {
  /* [DONE] prevent default action for this event */
  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log(href);
  /* [DONE] make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');

  /* [DONE] find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  /* [DONE] START LOOP: for each active author link */
  for (let activeAuthorLink of activeAuthorLinks) {

    /* [DONE] remove class active */
    activeAuthorLink.classList.remove('active');

  /* [DONE] END LOOP: for each active author link */
  }

  /* [DONE] find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log(authorLinks);
  /* [DONE] START LOOP: for each found author link */
  for (let authorLink of authorLinks) {

    /* [DONE] add class active */
    authorLink.classList.add('active');

  /* [DONE] END LOOP: for each found author link */
  }

  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors() {
  /* [DONE] find author links to authors */
  const authorLinks = document.querySelectorAll(select.all.linksTo.authors);

  /* [DONE] START LOOP: for each link */
  for (const authorLink of authorLinks) {

    /* [DONE] add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);

  /* [DONE] END LOOP: for each link */
  }
}

addClickListenersToAuthors();
