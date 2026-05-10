CREATE TABLE EMPLOYEE
(
  Ename VARCHAR(20)  ,
  Eid INT  ,
  Eaddress VARCHAR(50)  ,
  Ephone INT  ,
  Eemail VARCHAR(20)  ,
  Eseniority INT  ,
  PRIMARY KEY (Eid)
);

CREATE TABLE ROLE
(
  Rname VARCHAR(50)  ,
  Rdescription VARCHAR(100)  ,
  Rid INT ,
  Rrequirements_json JSONB  ,
  PRIMARY KEY (Rid)
);

CREATE TABLE BRANCH
(
  Bid INT  ,
  Bcity VARCHAR(20)  ,
  Baddress VARCHAR(50)  ,
  Bphone INT  ,
  Bname VARCHAR(20)  ,
  PRIMARY KEY (Bid)
);

CREATE TABLE SHIFT
(
  Sid INT  ,
  Stype VARCHAR(10)  ,
  Semp_num INT  ,
  Sdate DATE  ,
  Bid INT ,
  PRIMARY KEY (Sid),
  FOREIGN KEY (Bid) REFERENCES BRANCH(Bid)
);

CREATE TABLE EVENT
(
  EVdate DATE ,
  EVid INT,
  EVdescription VARCHAR(100) ,
  EVbudget INT ,
  EVtype VARCHAR(20) ,
  PRIMARY KEY (EVid)
);

CREATE TABLE GUIDENCE
(
  Gid INT ,
  Glocation VARCHAR(50) ,
  Gdescription_json JSONB ,
  Gdate DATE ,
  Ginstructor VARCHAR(20) ,
  PRIMARY KEY (Gid)
);

CREATE TABLE SCHEDULE
(
  Eid INT ,
  Sid INT,
  PRIMARY KEY (Eid, Sid),
  FOREIGN KEY (Eid) REFERENCES EMPLOYEE(Eid),
  FOREIGN KEY (Sid) REFERENCES SHIFT(Sid)
);

CREATE TABLE PARTICIPATE
(
  EVid INT ,
  Eid INT ,
  PRIMARY KEY (EVid, Eid),
  FOREIGN KEY (EVid) REFERENCES EVENT(EVid),
  FOREIGN KEY (Eid) REFERENCES EMPLOYEE(Eid)
);

CREATE TABLE ASSIGNTO
(
  Eid INT ,
  Gid INT ,
  PRIMARY KEY (Eid, Gid),
  FOREIGN KEY (Eid) REFERENCES EMPLOYEE(Eid),
  FOREIGN KEY (Gid) REFERENCES GUIDENCE(Gid)
);

CREATE TABLE HAS
(
  Hsalary INT ,
  Eid INT ,
  Rid INT ,
  PRIMARY KEY (Eid, Rid),
  FOREIGN KEY (Eid) REFERENCES EMPLOYEE(Eid),
  FOREIGN KEY (Rid) REFERENCES ROLE(Rid)
);