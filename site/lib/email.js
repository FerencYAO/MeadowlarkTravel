var nodemailer = require('nodemailer');
module.exports = function(credentials){
	var mailTransport = nodemailer.createTransport('SMTP',{
		host:'smtp.126.com',
		secureConnection:true,
		port:456,
		secure:true,
		auth:{
			user:credentials.netease.user,
			pass:credentials.netease.pass,
		}
	});
	var from = 'ferencyao@126.com';
	var errorRecipient = 'ferencyao@126.com';
	return {
		send:function(to,subj,body){
			mailTransport.sendMail({
				from:from,
				to:to,
				subject:subj,
				html:body,
				generateTextFromHtml:true
			}, function(err){
				if(err) console.error('Unable to send email: ' + err);
			});
		},
		emailError:function(message, filename, exception){
			var body = '<h1>Meadowlark Travel Site Error</h1>' +
				'message:<br><pre>' + message + '</pre><br>';
			if(exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
			if(filename) body+= 'filename:<br><pre>' + filename + '</pre><br>';
			mailTransport.sendMail({
				from:from,
				to:errorRecipient,
				subject:'Meadowlark Travel Site Error',
				html:body,
				generateTextFromHtml:true
			}, function(err){
				if(err) console.error('Unable to send email: ' + err);
			});
		},
	};
};