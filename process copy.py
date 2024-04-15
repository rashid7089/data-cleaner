import pandas as pd 

# def cleaningProcess(): # changed from main to cleaningProcess
#     try:
#         df = pd.read_json(input('Please enter your data set to be processed: '))
# #         display(df)
# #         display(df.info())
# # #         print(f"The dimensions of the DataFrame: {df.shape}")

#         cat_type = {}
#         for c in df.columns:
#             i = input(f"What type is ('{c}') attribute you want to be?\n numerical (n) or categorical (c)?")
#             if i == 'categorical':
#                 i = input ('What type of categorical?/n nominal (n) or ordinal (o)?')
#             cat_type[c] = i
#         print(cat_type)
#         null_columns = df.columns[df.isna().any()]
#         for c in null_columns:
#             if df[c].dtype!='object':
#                 value = df[c].mean()
#             else:
#                 value = df[c].mode()
#                 #print (value)
#                 value = value[0]  #0 will be the row(s) name
#                 #print (value)
#             df[c].fillna(value,inplace=True)
#         display(df)
#         display(df.info())
#         print('Your data set is ready!')
#     except:
#         print('Sorry, the given path is incorrect. Try again.')



# make it as class
class CleaningProcess:

    def __init__(self, path):
        # initialize the df
        self.df = None
        self.file_path = path
        self.cat_type = {}
    
    # read the json file
    def read_json(self):
        try:
            self.df = pd.read_json(self.file_path)
            return {"success":True}
        except:
            return {"success":False}
            # print('Sorry, the given path is incorrect. Try again.')

    
    # get The Types by input
    def get_types_by_input(self):
        if self.df is not None:
            for c in self.df.columns:
                i = input(f"What type is ('{c}') attribute you want to be?\n numerical (n) or categorical (c)?")
                if i == 'categorical':
                    i = input ('What type of categorical?/n nominal (n) or ordinal (o)?')
                self.cat_type[c] = i
            return self.cat_type
    

    def get_types_by_dict(self, cat_type):
        self.cat_type = cat_type
        return self.cat_type
    
    # clean the data
    def clean_data(self):
        if self.df is not None:
            null_columns = self.df.columns[self.df.isna().any()]
            for c in null_columns:
                if self.df[c].dtype!='object':
                    value = self.df[c].mean()
                else:
                    value = self.df[c].mode()
                    value = value[0]
                self.df[c].fillna(value,inplace=True)
            return self.df


    # get the info of the dataframe
    def get_info(self):
        if self.df is not None:
            return self.df.info()
        else:
            return "Please read the json file first."




