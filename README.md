# Vehicle Parking Slot Allotment System 

# Technology stack:
    1.Backend - Nodejs
    2.Frontend - Angular
    3.Database - MongoDB
    4.Server - Heroku

# installation
    1. npm i 
# Run
    2. npm run dev
    
# Working - 
 1. Slot allotment - 
      - Used Nodejs and Advance Mongo Queries(aggregations) for finding empty slots on following conditions
        1. Level should be filled linearly
        2. Motorcycle - 
          1.1 Slot type - ANY
          1.2 Space - 1 slot
        3. Car - 
          1.1 Slot Type - Large, Compact
          1.2 Space - 1 slot
        4. Bus - 
          1.1 Slot Type - Large
          1.2 Space - 5 Slots
 
 ### 2. Modules 
 1. Home Module 
    - Features
        1. Allot Parking (By entering vehicle type and vehicle number)
        2. Search Car by Vehicle number - returns its loction if car is present in Parking Lot. 
 2. Exit Module
    - Features
        1. Count of Vehicles - sorted by vehicle type
        2. Exit vehicle Module - All vehicle present in system sorted linearly and can be exited
 3. Level Module - (In progress)
    
              
          
