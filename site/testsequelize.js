var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:250335627@localhost:3306/test',{define:{engine:'InnoDB'}});
/* var User = sequelize.define('User',{
	username:Sequelize.STRING,
	birthday:Sequelize.DATE
});
return sequelize.sync().then(function(){
	return User.create({
		username:'janedoe',
		birthday:new Date(1980,6,20)
	});
}).then(function(jane){
	console.log(jane.get({
		plain:true
	}))
}); */
/* var Project = sequelize.define('Project',{
	title:Sequelize.STRING,
	description:Sequelize.TEXT
})
var Task = sequenlize.define('Task',{
	title:Sequelize.STRING,
	description:Sequelize.TEXT,
	deadline:Sequelize.DATE
})
var Foo = sequelize.define('Foo',{
	flag:{type:Sequelize.BOOLEAN,allowNull:false,defaultValue:true},
	myDate:{type:Sequelize.DATE,defaultValue:Sequelize.NOW},
	title:{type:Sequelize.STRING,allowNull:false},
	someUnique:{type:Sequelize.STRING,unique:true},
	uniqueOne:{type:Sequelize.STRING,unique:'compositeIndex'},
	uniqueTwo:{type:Sequelize.INTEGER,unique:'compositeIndex'},
	identifier:{type:Sequelize.STRING,primaryKey:true},
	incrementMe:{type:Sequelize.INTEGER,autoIncrement:true},
	hasComment:{type:Sequelize.INTEGER,commit:"I'm a comment!"},
	fieldWithUnderscores:{type:Sequelize.STRING,field:"field_with_underscores"}
}) */
/* var Employee = sequelize.define('Employee',{
	name:{
		type:Sequelize.STRING,
		allowNull:false,
		get:function(){
			var title = this.getDataValue('title');
			return this.getDataValue('name') + '(' + title + ')';
		},
	},
	title:{
		type:Sequelize.STRING,
		allowNull:false,
		set:function(val){
			this.setDataValue('title', val.toUpperCase());
		}
	}
});
Employee.sync()
Employee.create({name:'John Doe',title:'senior engineer'}).then(function(employee){
	console.log(employee.get('name'));
	console.log(employee.get('title'));
}) */
/* var Foos = sequelize.define('Foos',{
	firstname:Sequelize.STRING,
	lastname:Sequelize.STRING
},{
	getterMethods:{
		fullName:function(){return this.firstname+' '+this.lastname}
	},
	setterMethods:{
		fullName:function(value){
			var names = value.split(' ');
			this.setDataValue('firstname',names.slice(0,-1).join(' '));
			this.setDataValue('lastname',names.slice(-1).join(' '));
		},
	}
});
Foos.sync()
Foos.create({fullName:'lmy yao'}).then(function(foos){
	console.log(foos.get('firstname'));
	console.log(foos.get('lastname'));
	console.log(foos.get('fullName'));
}) */
/* var ValidateMe = sequelize.define('Foos',{
	foos:{
		type:Sequelize.STRING,
		validate:{
			is:["^[a=z]+$",'i'],
			is:/^[a-z]+$/i,
			not:["[a-z]",'i'],
			isEmail:true,
			isUrl:true,
			isIP:true,
			isIPv4:true,
			isIPv6:true,
			isAlpha:true,
			isAlphanumeric:true,
			isNumberic:true,
			isInt:true,
			isFlot:true,
			isDecimal:true,
			isLowercase:true,
			isUppercase:true,
			notNull:true,
			isNull:true,
			notEmpty:true,
			equals:'specific value',
			contains:'foos',
			notIn:[['foos','bars']],
			isIn:[['foos','bars']],
			notContains:'bars',
			len:[2,10],
			isUUID:4,
			isDate:true,
			isAfter:"2011-11-05",
			isBefore:"2011-11-05",
			max:23,
			min:23,
			isArray:true,
			isCreditCard:true,
			isEven:function(value){
				if(parseInt(value) % 2 !=0){
					throw new Error('Only even values are allowed!')
				}
			}
		}
	}
}) */
/* var Pubs = sequelize.define('Pubs',{
	name:{type:Sequelize.STRING},
	address:{type:Sequelize.STRING},
	latitude:{
		type:Sequelize.INTEGER,
		allowNull:true,
		defaultValue:null,
		validate:{min:-90,max:90}
	},
	longitude:{
		type:Sequelize.INTEGER,
		allowNull:true,
		defaultValue:null,
		validate:{min:-180,max:180}
	},
},{
	validate:{
		bothCoordsOrNone:function(){
			if((this.latitude===null)!==(this.longitude===null)){
				throw new Error('Require either both latitude and longitude or neither')
			}
		}
	}
})
Pubs.sync()
Pubs.create({name:'testname10',address:'创新工业园10',latitude:50,longitude:50}).then(function(pubs){
	console.log(pubs.latitude);
	console.log(pubs.longitude);
}) */
/* var Bar = sequelize.define('Bar',{name:Sequelize.STRING,address:Sequelize.STRING},{
	timestamps:true,
	paranoid:true,
	freezeTableName:true
})
Bar.sync()
Bar.create({name:'test1',address:'testaddress'}).then(function(bar){
	console.log(bar.name);
	console.log(bar.address);
}) */
/* var Foo = sequelize.define('Foo',{name:Sequelize.STRING,address:Sequelize.STRING},{
	timestamps:true,
	createdAt:false,
	updateAt:'updateTimestamp',
	deletedAt:'destoryTime',
	paranoid:true
})
Foo.sync() */
/* var Person=sequelize.define('Person',{name:Sequelize.STRING,address:Sequelize.STRING},{engine:'MYISAM'})
Person.sync() */
/* var Person = sequelize.define('Person',{name:Sequelize.STRING,address:Sequelize.STRING},{
	commit:"I'm a table comment!"
})
Person.sync() */
/* var Foo = sequelize.define('Foo',{name:Sequelize.STRING,address:Sequelize.STRING},{
	classMethods:{
		method1:function(){return 'smth'}
	},
	instanceMethods:{
		method2:function(){return 'foo'}
	}
})
console.log(Foo.method1())
console.log(Foo.build().method2()) */
/* var User = sequelize.define('User',{firstname:Sequelize.STRING,lastname:Sequelize.STRING},{
	instanceMethods:{
		getFullname:function(){
			return [this.firstname,this.lastname].join(' ')
		}
	}
})
console.log(User.build({firstname:'foo',lastname:'bar'}).getFullname()) */
/* var Pubs = sequelize.define('Pubs',{
	name:{type:Sequelize.STRING},
	address:{type:Sequelize.STRING},
	latitude:{
		type:Sequelize.INTEGER,
		allowNull:true,
		defaultValue:null,
		validate:{min:-90,max:90}
	},
	longitude:{
		type:Sequelize.INTEGER,
		allowNull:true,
		defaultValue:null,
		validate:{min:-180,max:180}
	},
},{
	validate:{
		bothCoordsOrNone:function(){
			if((this.latitude===null)!==(this.longitude===null)){
				throw new Error('Require either both latitude and longitude or neither')
			}
		}
	}
})
Pubs.find(5).then(function(pubs){
	console.log(pubs.address)
})
Pubs.find({where:{name:'testname'}}).then(function(pubs){
	console.log(pubs.address)
})
Pubs.find({
	where:{name:'testname'},
	attributes:['id',['name','address']]
}).then(function(pubs){
	console.log(pubs.name)
	console.log(pubs.address)
})
 */
/* var User = sequelize.define('User',{
	username:Sequelize.STRING,job:Sequelize.STRING
})
User.sync()
User
	.findOrCreate({where:{username:'sdepold'},defaults:{job:'Technical lead JavaScript'}})
	.spread(function(user,created){
		console.log(user.get({
			plain:true
		}))
		console.log(created)
	})
User
	.create({username:'fnord',job:'omnomnom'})
	.then(function(){
		User
			.findOrCreate({where:{username:'fnord'},defaults:{job:'something else'}})
			.spread(function(user,created){
				console.log(user.get({
					plain:true
				}))
				console.log(created)
			})
	}) */
/* var User = sequelize.define('User',{
	username:Sequelize.STRING,job:Sequelize.STRING
})
User
	.create({username:'fnord',job:'omnomnom'})
	.then(function(){
		User
			.findOrCreate({where:{username:'fnord'},defaults:{job:'something else'}})
			.spread(function(user,created){
				console.log(user.get({
					plain:true
				}))
				console.log(created)
			})
	}) */
/* var User = sequelize.define('User',{
	username:Sequelize.STRING,job:Sequelize.STRING
})
User
  .findAndCountAll({
     where: ["username LIKE 'fnord%'"],
     offset: 10,
     limit: 2
  })
  .then(function(result) {
    console.log(result.count);
    console.log(result.rows);
  }); */
