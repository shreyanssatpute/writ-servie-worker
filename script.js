var historyList = [];
var sidebarVisible = false;
var qrCodeSize = 120; // Set the desired QR code size

// Load history from local storage
if (localStorage.getItem('qrHistory')) {
  historyList = JSON.parse(localStorage.getItem('qrHistory'));
  updateHistoryList();
}

// Check if QR code widget should display default image on page load
window.addEventListener('DOMContentLoaded', function() {
  var qrCodeWidget = document.getElementById('qr-code-widget');
  var qrText = document.getElementById('qr-text').value;

  if (qrText.trim() === '') {
    var defaultImage = new Image();
    defaultImage.src = 'pic.jpg';
    defaultImage.alt = 'QR Code';
    defaultImage.width = qrCodeSize;
    defaultImage.height = qrCodeSize;
    qrCodeWidget.appendChild(defaultImage);
  } else {
    generateQRCode();
  }
});

function generateQRCode() {
  var qrText = document.getElementById('qr-text').value;
  var qrCodeDiv = document.getElementById('qr-code-widget');

  // Clear previous QR code if exists
  qrCodeDiv.innerHTML = '';

  if (qrText.trim() === '') {
    var defaultImage = new Image();
    defaultImage.src = 'pic.jpg';
    defaultImage.alt = 'QR Code';
    defaultImage.width = qrCodeSize;
    defaultImage.height = qrCodeSize;
    qrCodeDiv.appendChild(defaultImage);
  } else {
    // Create QR code using the QRCode.js library
    var qrcode = new QRCode(qrCodeDiv, {
      text: qrText,
      width: qrCodeSize,
      height: qrCodeSize
    });

    setTimeout(function() {
      // Create a canvas element to get QR code image
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var qrCodeImage = qrCodeDiv.getElementsByTagName('img')[0];

      // Draw the QR code image onto the canvas
      canvas.width = qrCodeImage.width;
      canvas.height = qrCodeImage.height;
      context.drawImage(qrCodeImage, 0, 0);

      // Convert canvas to base64 data URL
      var qrCodeImgDataUrl = canvas.toDataURL();

      // Add to history
      historyList.push({
        text: qrText,
        url: qrCodeImgDataUrl
      });

      // Update history list
      updateHistoryList();

      // Save history to local storage
      localStorage.setItem('qrHistory', JSON.stringify(historyList));
    }, 100);
  }
}

function updateHistoryList() {
  var historyListElement = document.getElementById('history-list');
  historyListElement.innerHTML = '';
  historyList.forEach(function(item) {
    var listItem = document.createElement('div');
    listItem.classList.add('history-box');
    listItem.innerHTML = '<img src="' + item.url + '" alt="QR Code">' +
      '<div class="history-box-text">' + item.text + '</div>';
    listItem.addEventListener('click', function() {
      showQRCodeModal(item.url);
    });
    historyListElement.appendChild(listItem);
  });
}

function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  sidebarVisible = !sidebarVisible;

  if (sidebarVisible) {
    sidebar.classList.add('sidebar-visible');
  } else {
    sidebar.classList.remove('sidebar-visible');
  }
}

function showQRCodeModal(url) {
  var modal = document.createElement('div');
  modal.classList.add('qr-code-modal');

  var modalContent = document.createElement('div');
  modalContent.classList.add('qr-code-modal-content');

  var qrCodeImage = document.createElement('img');
  qrCodeImage.src = url;
  qrCodeImage.alt = 'QR Code';

  var closeModal = document.createElement('div');
  closeModal.classList.add('qr-code-modal-close');
  closeModal.innerHTML = 'X';
  closeModal.style.color = 'red';
  closeModal.style.fontSize = '34px';
  closeModal.addEventListener('click', function() {
    modal.classList.remove('active');
    setTimeout(function() {
      modal.remove();
    }, 300);
  });

  modalContent.appendChild(qrCodeImage);
  modalContent.appendChild(closeModal);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  setTimeout(function() {
    modal.classList.add('active');
  }, 10);
}

function clearHistory() {
  historyList = [];
  updateHistoryList();
  localStorage.removeItem('qrHistory');
}

function redirectToURL(url) {
  window.location.href = url;
}
function downloadQRCode() {
  const qrCodeDiv = document.getElementById('qr-code-widget');
  const qrCodeDataUrl = qrCodeDiv.querySelector('img').src;

  // Create a temporary anchor element
  const downloadLink = document.createElement('a');
  downloadLink.href = qrCodeDataUrl;
  downloadLink.download = 'qrcode.png';

  // Trigger the download
  downloadLink.click();

  // Cleanup
  document.body.removeChild(downloadLink);
}