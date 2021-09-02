create table Users (
	Id int auto_increment not null,
	Username varchar(32) not null,
	Password varchar(128) not null,
	FirstName varchar(64) not null,
	LastName varchar(64) not null,
	Email varchar(128) not null,
	UserType varchar(32) not null,
	Image varchar(256) not null,
	constraint PK_User primary key (Id)
);

create table Boards (
	Id int auto_increment not null,
	Name varchar(32) not null,
	Admin varchar(32) not null,
	TeamId int null,
	IsPomodoro tinyint not null default 0,
	WorkTime int not null default 25,
	BreakTime int not null default 5,
	Iterations int not null default 4,
	LongerBreak int not null default 30,
	constraint PK_Board primary key (Id)
);

create table Teams (
	Id int auto_increment not null,
	Name varchar(32) not null,
	Admin varchar(32) not null,
	constraint PK_Team primary key (Id)
);

create table Columns (
	Id int auto_increment not null,
	Name varchar(32) not null,
	ColumnOrder int,
	IsDone tinyint not null default 0,
	BoardId int null,
	constraint PK_Column primary key (Id)
);

create table Tickets (
	Id int auto_increment not null,
	Title varchar(128) not null,
	Description varchar(3000) not null,
	Creator varchar(32) not null,
	Status varchar(32) not null,
	StoryPoints int null,
	DateCreated datetime(3) null,
	AssignedTo int null,
	StartDate datetime(3) null,
	EndDate datetime(3) null,
	ColumnRank int default 1,
	Priority int,
	ColumnId int null,
	CompletedAt DateTime(3) null,
	constraint PK_Ticket primary key (Id)
);

alter table Boards
add constraint FK_Board_Team
foreign key (TeamId) references Teams(Id);

alter table Columns
add constraint FK_Column_Board
foreign key (BoardId) references Boards(Id);

alter table Tickets
add constraint FK_Ticket_Column
foreign key (ColumnId) references Columns(Id);

alter table Tickets
add constraint FK_Ticket_User
foreign key (AssignedTo) references Users(Id);

create table UsersTeams (
	Id int auto_increment not null,
	UserId int not null,
	TeamId int not null,
	constraint PK_UsersTeams primary key (Id)
);

alter table UsersTeams
add constraint FK_UsersTeams_Users
foreign key (UserId) references Users(Id);

alter table UsersTeams
add constraint FK_UsersTeams_Teams
foreign key (TeamId) references Teams(Id);

create table Notifications (
	Id int auto_increment not null,
	OnChange tinyint not null default 0,
	OnChangeMine tinyint not null default 0,
	OnComment tinyint not null default 0,
	OnCommentMine tinyint not null default 0,
	OnStatusChange tinyint not null default 0,
	OnStatusChangeMine tinyint not null default 0,
	UserId int not null,
	Constraint PK_Notifications primary key (Id)
);

alter table Notifications
add constraint FK_Notifications_Users 
foreign key (UserId) references Users(Id);

create table Labels (
	Id int auto_increment not null,
	Name varchar(20) not null,
	Color varchar(7) not null,
	Constraint PK_Labels primary key (Id)
);

create table LabelsTickets (
	Id int auto_increment not null,
	LabelId int not null,
	TicketId int not null,
	Constraint PK_LabelsTickets primary key (Id)
);

alter table LabelsTickets
add constraint FK_LabelsTickets_Tickets foreign key (TicketId) references Tickets(Id);

alter table LabelsTickets
add constraint FK_LabelsTickets_Labels foreign key (LabelId) references Labels(Id);

create table Favorites (
	Id int auto_increment not null,
	TicketId int not null,
	UserId int not null,
	constraint PK_Favorites primary key (Id)
);

alter table Favorites
add constraint FK_Favorites_Tickets foreign key (TicketId) references Tickets(Id);

alter table Favorites
add constraint FK_Favorites_Users foreign key (UserId) references Users(Id);

create table Comments (
	Id int auto_increment  not null,
	CommentedAt date not null,
	Text varchar(500) not null,
	UserId int not null,
	TicketId int not null,
	constraint PK_Comments primary key (Id)
);

alter table Comments
add constraint FK_Comments_Users foreign key (UserId) references Users(Id);

alter table Comments
add constraint FK_Comments_Tickets foreign key (TicketId) references Tickets(Id);

create table TicketsDependencies (
	Id int auto_increment  not null,
	TicketId int not null,
	DependencyId int not null,
	constraint PK_TicketsDependencies primary key (Id)
);

alter table TicketsDependencies
add constraint FK_TicketsDependencies_Tickets foreign key (TicketId) references Tickets(Id);

alter table TicketsDependencies
add constraint FK_TicketsDependencies_Tickets foreign key (DependencyId) references Tickets(Id);

INSERT INTO users (`Username`, `Password`, `FirstName`, `LastName`, `Email`, `UserType`, `Image`) VALUES ('admin', '804f50ddbaab7f28c933a95c162d019acbf96afde56dba10e4c7dfcfe453dec4bacf5e78b1ddbdc1695a793bcb5d7d409425db4cc3370e71c4965e4ef992e8c4', 'Admin', 'Admin', 'admin@gmail.com', 'admin', 'Resources\\Images\\profile.png');