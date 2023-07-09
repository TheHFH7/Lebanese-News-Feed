document.addEventListener('DOMContentLoaded', function() {
  const newsFeed = document.getElementById('news-feed');

  // Array of Lebanese news websites with their news feed URLs
  const newsWebsites = [
    {
      name: 'News Website 1',
      url: 'https://www.lbcgroup.tv/Rss/latest-news/en', // Replace with the actual news feed URL
    },
    {
      name: 'News Website 2',
      url: 'https://www.lbcgroup.tv/Rss/latest-news/ar', // Replace with the actual news feed URL
    },
    {
      name: 'News Website 3',
      url: 'https://www.aljazeera.com/xml/rss/all.xml', // Replace with the actual news feed URL
    },
    // Add more news websites here
  ];

  newsWebsites.forEach(function(website) {
    fetch(website.url)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');

        const items = xmlDoc.querySelectorAll('item'); // Adjust the selectors based on the XML structure of the news feeds

        items.forEach(function(item) {
          const title = item.querySelector('title').textContent;
          const link = item.querySelector('link').textContent;

          const newsItem = document.createElement('div');
          newsItem.classList.add('news-item');

          // Thumbnail extraction
          fetch(link)
            .then(response => response.text())
            .then(htmlData => {
              const thumbnailURL = extractThumbnailFromHTML(htmlData);
              if (thumbnailURL) {
                const thumbnail = document.createElement('img');
                thumbnail.src = thumbnailURL;
                thumbnail.alt = 'Thumbnail';
                newsItem.appendChild(thumbnail);
              }
            })
            .catch(error => console.log(error));

          const newsLink = document.createElement('a');
          newsLink.href = link;
          newsLink.innerHTML = title; // Use innerHTML instead of textContent
          newsLink.target = '_blank'; // Open link in a new tab

          newsItem.appendChild(newsLink);
          newsFeed.appendChild(newsItem);
        });
      })
      .catch(error => console.log(error));
  });
});

function extractThumbnailFromHTML(htmlData) {
  const doc = new DOMParser().parseFromString(htmlData, 'text/html');

  // Extract thumbnail using Open Graph Protocol (OGP) or HTML <meta> tags
  const ogImage = doc.querySelector('meta[property="og:image"]');
  if (ogImage) {
    return ogImage.getAttribute('content');
  }

  const metaImage = doc.querySelector('meta[name="image"]');
  if (metaImage) {
    return metaImage.getAttribute('content');
  }

  // Add additional logic if required

  return null; // Return null if no thumbnail is found
}
