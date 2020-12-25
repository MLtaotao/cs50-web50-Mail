document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //Send email when click submit button
  document.querySelector('#compose-form').onsubmit = sendEmail;

  //display default inbox view
  load_mailbox('inbox');

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    // Sort emails
    emails.sort(function(x, y){
      return x.timestamp - y.timestamp;
    });

    // Creat a table object
    let table = document.createElement('table');
    table.className = "table";
    table.id = "tableId";
    //Creat thead
    let table_head = document.createElement('thead');
    table_head.innerHTML = "<th scope=\"col\">Id</th><th scope=\"col\">Sender</th><th scope=\"col\">Subject</th><th scope=\"col\">Timestamp</th><th scope=\"col\"></th>";
    
    table.append(table_head);
    // creat table body and add element
    let table_body = document.createElement('tbody');
    if (mailbox == "inbox") {
      emails.forEach(email => {
        let table_row = document.createElement('tr');
        table_row.id = email.id;
        var datetime = new Date(email.timestamp);
        table_row.innerHTML = `<th scope="row">${email.id}</th>
        <td>${email.sender}</td>
        <td>${email.subject}</td>
        <td>${datetime.toLocaleString()}</td>
        <td><button type="button" class="btn btn-secondary id="mail-archive">Archive</button></td>`;
  
        // set table row link to the email
        table_row.getElementsByTagName('td')[0].addEventListener('click', () => view_email(email.id), false);
        table_row.getElementsByTagName('td')[1].addEventListener('click', () => view_email(email.id), false);
        table_row.getElementsByTagName('td')[2].addEventListener('click', () => view_email(email.id), false);
        table_row.getElementsByTagName('td')[3].addEventListener('click', () => archive_email(email.id), false);
        // table_row.addEventListener('click', () => view_email(email.id), false);
  
        //If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
        if (email.read !== false) {
          table_row.style.backgroundColor = 'lightgray'
        }
        table_body.append(table_row);
      });
    } 
    else if (mailbox == "archive"){
      emails.forEach(email => {
        let table_row = document.createElement('tr');
        table_row.id = email.id;
        var datetime = new Date(email.timestamp)
        table_row.innerHTML = `<th scope="row">${email.id}</th>
        <td>${email.sender}</td>
        <td>${email.subject}</td>
        <td>${datetime.toLocaleString()}</td>
        <td><button type="button" class="btn btn-secondary id="mail-archive">Unarchive</button></td>`;
  
        // set table row link to the email
        table_row.getElementsByTagName('td')[0].addEventListener('click', () => view_email(email.id), false);
        table_row.getElementsByTagName('td')[1].addEventListener('click', () => view_email(email.id), false);
        table_row.getElementsByTagName('td')[2].addEventListener('click', () => view_email(email.id), false);
        table_row.getElementsByTagName('td')[3].addEventListener('click', () => unarchive_email(email.id), false);
        // table_row.addEventListener('click', () => view_email(email.id), false);
  
        //If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
        if (email.read !== false) {
          table_row.style.backgroundColor = 'lightgray'
        }
        table_body.append(table_row);
      });
    }
    else {
      emails.forEach(email => {
        let table_row = document.createElement('tr');
        table_row.id = email.id;
        var datetime = new Date(email.timestamp)
        table_row.innerHTML = `<th scope="row">${email.id}</th>
        <td>${email.sender}</td>
        <td>${email.subject}</td>
        <td>${datetime.toLocaleString()}</td>`;
  
        // set table row link to the email
        table_row.getElementsByTagName('td')[0].addEventListener('click', () => view_email(email.id), false);
        table_row.getElementsByTagName('td')[1].addEventListener('click', () => view_email(email.id), false);
        table_row.getElementsByTagName('td')[2].addEventListener('click', () => view_email(email.id), false);
        // table_row.addEventListener('click', () => view_email(email.id), false);
  
        table_body.append(table_row);
      });
    }

    table.append(table_body);
    table.style.textAlign = 'center';
    document.querySelector('#emails-view').append(table);

  });
}

function sendEmail() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  load_mailbox('sent');
  return false;
}

function view_email(email_id) {
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
      document.querySelector('#compose-view').style.display = 'none';

      // Show the mailbox and hide other views
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-view').style.display = 'block';

      var datetime = new Date(email.timestamp)
      document.querySelector('#email-sender').innerHTML = `<b class="font-weight-bolder">From:</b> ${email.sender}`;
      document.querySelector('#email-recipients').innerHTML = `<b class="font-weight-bolder"> To:</b> ${email.recipients}`;
      document.querySelector('#email-subject').innerHTML = `<b class="font-weight-bolder"> Subject:</b> ${email.subject}`;
      document.querySelector('#email-timestamp').innerHTML = `<b class="font-weight-bolder"> Timestamp:</b> ${datetime.toLocaleString()}`;
      document.querySelector('#email-body').innerHTML = `<p class="text-monospace">${email.body}</p>`;
      document.querySelector('#email-reply').addEventListener('click',() => reply_email(email), false)
  });
  //Once the email has been clicked on, you should mark the email as read. Recall that you can send a PUT request to /emails/<email_id> to update whether an email is read or not.
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });
}

function archive_email(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  });
  location.reload();
}

function unarchive_email(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  });
  location.reload();
}

function reply_email(email) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = `${email.sender}`;
  document.querySelector('#compose-recipients').disabled = true;
  if (email.subject.substring(0,4)=='Re: ') {
    document.querySelector('#compose-subject').value = email.subject;
  }
  else {
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  }
  var datetime = new Date(email.timestamp);
  document.querySelector('#compose-body').value = `
  

  ---------------
  On ${datetime.toLocaleString()} ${email.sender} wrote:
  ${email.body}`;
}