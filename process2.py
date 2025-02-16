# attibutes description:
# 1. file_path: file
# 2. columnsTypes: dictionary

# 3. toImputeList: list of list - [[string: feature, string: Impute_type],...]
## * don't allow the same feature to be picked twice
## * only columns with null values can be picked

# 4. NormalizationSequence: list of list - [[string: feature, string: Normalization_type],...]
## * don't allow the same feature to be picked twice
## * only numirical features can be picked

# 5. NominalEncodingSequence: [[string: feature, string: encodingType],...]
## * don't allow the same feature to be picked twice
## * only nominal features can be picked

# 6. OrdinalEncodingSequence: list of string
## * don't allow the same feature to be picked twice
## * only ordinal features can be picked
# from sklearn.preprocessing import StandardScaler
# from sklearn.preprocessing import MinMaxScaler
# import scipy.stats as stats
# from sklearn.preprocessing import LabelEncoder
import os

def generateRandomFileName():
    import random
    import string
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))


def mainProcess(file_path, columnsTypes, toImputeList, NormalizationSequence, NominalEncodingSequence, OrdinalEncodingSequence, ordinalOrders):
    try:
        # Establishing the data frame and prompting the attribute names
        # df = pd.read_csv(input('Please enter your data set to be processed: '))
        try:
            import pandas as pd 
            df = pd.read_csv(file_path)
        except:
            return {"message": "File Error: wrong input or file not in csv format"}

        try:
            df = df.rename(columns=lambda x: x.strip())
        except:
            pass

        num_type = []
        nom_type = []
        ord_type = []

        # -- for-loop input ------------------------------

        try:
            for feature, feature_type in columnsTypes.items():
                if feature_type == 'nominal':
                    nom_type.append(feature)
                elif feature_type == 'ordinal':
                    ord_type.append(feature)
                else:
                    num_type.append(feature)
        except:
            return {"message": "columnsTypes Error: wrong input"}
        # for c in df.columns:
        #     # i = input(f"What type is ('{c}') attribute you want to be?\n numerical (nu), nominal (no), or ordinal (o)?")
        #     i = columnsTypes[c]
        #     if i == 'nominal':
        #         nom_type.append(c)
        #     elif i == 'ordinal':
        #         ord_type.append(c)
        #     else:
        #         num_type.append(c)
        print()
        print(f"The numerical attributes: {num_type}")
        print(f"The nominal attributes: {nom_type}")
        print(f"The ordinal attributes: {ord_type}")
        print()
        
        # Cleaning the data
        # null_columns = df.columns[df.isna().any()]
        # for c in null_columns:
        #     flag = True
        #     while flag == True:
        #         k = input(f"'{c}' column has null value(s): What do you want to do?\n a) Impute \n b) Delete the row\n")
        #         if k == 'b':
        #             df = df.drop(df[df[c].isnull()].index)
        #             df = df.reset_index(drop = True)
        #             flag = False
        #         elif k == 'a' and df[c].dtype!='object':
        #             j = input(f"What kind of imputation do you want to apply?\n a) Impute mean\n b) Impute median\n c) Impute Mode\n")
        #             if j == 'a':
        #                 value = df[c].mean()
        #                 df[c].fillna(value,inplace=True)
        #                 flag = False
        #             elif j == 'b':
        #                 value = df[c].median()
        #                 df[c].fillna(value,inplace=True)
        #                 flag = False
        #             elif j == 'c':
        #                 value = df[c].mode()
        #                 value = value[0] #0 will be the row(s) name
        #                 df[c].fillna(value,inplace=True)
        #                 flag = False
        #         elif k=='a' and df[c].dtype =='object':
        #             value = df[c].mode()
        #             value = value[0] #0 will be the row(s) name
        #             df[c].fillna(value,inplace=True)
        #             flag = False
        #         else:
        #             print('Sorry, you have entered a wrong input. Try again.')
        try:
            for feature, impute_type in toImputeList:
            
                if impute_type == 'mean':
                    value = df[feature].mean()
                    df[feature].fillna(value,inplace=True)
                elif impute_type == 'median':
                    value = df[feature].median()
                    df[feature].fillna(value,inplace=True)
                elif impute_type == 'mode':
                    value = df[feature].mode()
                    value = value[0]
                    df[feature].fillna(value,inplace=True)
                elif impute_type == 'delete':
                    df = df.drop(df[df[feature].isnull()].index)
                    df = df.reset_index(drop = True)
                else:
                    print('Impute Error: wrong input')
        except:
            return {"message": "Impute Error: wrong input"}

        print("toImputeList passed")
        # Normalising
        
        
        # norm_num = num_type.copy() # numerical attributes
        # flag2 = True
        # while flag2 == True:
        #     a = input('What type of normalisation do you want to perform:\n 1) Standard Scalar\n 2) Min-Max Scalar\n 3) z-score\n 4) None\n')
           
        #     if a =='4':
        #         break
        #     elif a == '1':
        #         string = ""
        #         for i in norm_num:
        #             string = string + '\n' + str(i)
        #         feature = input(f"Which feature do you want to perform Standard Scalar: {string}\n")

        #         norm_num.remove(feature)
                
        #         # Standard Scalar
        #         scaler = StandardScaler()
        #         scaler.fit(df[[feature]])
        #         df[feature]=scaler.transform(df[[feature]])
        #         print(f'The mean and std values are', df[feature].mean(), ' and ', df[feature].std())
                
        #     elif a == '2':
        #         string = ""
        #         for i in norm_num:
        #             string = string + '\n' + str(i)
        #         feature = input(f"Which feature do you want to perform Min-Max Scalar: {string}\n")
        #         norm_num.remove(feature)
                
        #         # Min-Max Scalar
        #         scaler2 = MinMaxScaler()
        #         scaler2.fit(df[[feature]])
        #         df[feature]=scaler2.transform(df[[feature]])
        #         print(f'The max and min values are', df[feature].max(), ' and ', df[feature].min())
        #     else:
        #         string = ""
        #         for i in norm_num:
        #             string = string + '\n' + str(i)
        #         feature = input(f"Which feature do you want to perform z-score: {string}\n")
        #         norm_num.remove(feature)
                
        #         # Z-score 
        #         df[feature] = stats.zscore(df[feature])
        #     b = input('Do want to do another normalisation:\n 1) Yes\n 2) No\n')
        #     if b=='2' or norm_num == []:
        #         flag2 = False
        

        ## convert into for loop using NormalizationSequence
        try:
            # import if needed
            norms_types = [norm_type for feature, norm_type in NormalizationSequence]
            if 'StandardScaler' in norms_types:
                from sklearn.preprocessing import StandardScaler
            if 'MinMaxScaler' in norms_types:
                from sklearn.preprocessing import MinMaxScaler
            if 'z-score' in norms_types:
                import scipy.stats as stats

            for feature, norm_type in NormalizationSequence:
                if norm_type == 'StandardScaler':
                    scaler = StandardScaler()
                    scaler.fit(df[[feature]])
                    df[feature]=scaler.transform(df[[feature]])
                    print(f'The mean and std values are', df[feature].mean(), ' and ', df[feature].std())
                elif norm_type == 'MinMaxScaler':
                    scaler2 = MinMaxScaler()
                    scaler2.fit(df[[feature]])
                    df[feature]=scaler2.transform(df[[feature]])
                    print(f'The max and min values are', df[feature].max(), ' and ', df[feature].min())
                elif norm_type == 'z-score':
                    df[feature] = stats.zscore(df[feature])
                elif norm_type == 'None':
                    pass
                else:
                    print("Normalization Error: no selection")
        except Exception as e:
            print("Normalization Error: wrong input")
            print(e)
            return {"message": "Normalization Error: wrong input"}

        print("NormalizationSequence passed")
        # display(df)

        # Feature transformation for One Hot Enconding
        # norm_nom = nom_type.copy()
        # flag3 = True
        # while flag3 == True:
        #     b = input('Do you want to perform One Hot Encoding:\n 1) yes\n 2) no\n')
        #     if b =='2':
        #         flag3 = False
        #     else:
        #         string2 = ""
        #         for i in norm_nom:
        #             string2 = string2 + '\n' + str(i)
        #         feature2 = input(f"Which feature do you want to perform One Hot Encoding: {string2}\n")
        #         norm_nom.remove(feature2)
        #         print(df[feature2].unique())
        #         df = pd.get_dummies(df, columns=[feature2],drop_first=True) #Remove first level to get k-1 dummies out of k categorical levels.
        #         if norm_nom == []:
        #             flag3 = False

        # Feature transformation for Label Encoder

        # flag4 = True
        # while flag4 == True:
        #     d = input('Do you want to perform Label Encoding:\n 1) yes\n 2) no\n')
        #     if d =='2':
        #         flag4 = False
        #     else:
        #         string3 = ""
        #         for i in norm_nom:
        #             string3 = string3 + '\n' + str(i)
        #         feature3 = input(f"Which feature do you want to perform Label Encoding: {string3}\n")
        #         encoder1 = LabelEncoder()
        #         encoder1.fit(df[feature3])
        #         df[feature3]=encoder1.transform(df[feature3])
        #         print(f'The new values are', df[feature3].unique())
        #         norm_nom.remove(feature3)
        #         if norm_nom == []:
        #             flag4 = False
        # combine label encoding and one hot encoding using NominalEncodingSequence
        try:
            for feature, encoding_type in NominalEncodingSequence:
                if encoding_type == 'LabelEncoder':
                    from sklearn.preprocessing import LabelEncoder
                    encoder1 = LabelEncoder()
                    encoder1.fit(df[feature])
                    df[feature]=encoder1.transform(df[feature])
                    print(f'The new values are', df[feature].unique())
                elif encoding_type == 'OneHotEncoder':
                    df = pd.get_dummies(df, columns=[feature],drop_first=True)
                elif encoding_type == 'None':
                    pass
                else:
                    print("Nominal Encoding Error: wrong input")
            df.replace({False: 0, True: 1}, inplace=True)
        except:
            return {"message": "Nominal Encoding Error: wrong input"}
        
        print("NominalEncodingSequence passed")
        # Feature transformation for Ordinal Enconder
        # norm_ord = ord_type.copy()
        # flag5 = True
        # while flag5 == True:
        #     e = input('Do you want to perform Ordinal Encoding:\n 1) yes\n 2) no\n')
        #     if e =='2':
        #         flag5 = False
        #     else:
        #         string4 = ""
        #         for i in norm_ord:
        #             string4 = string4 + '\n' + str(i)
        #         feature3 = input(f"Which feature do you want to perform Ordinal Encoding: {string4}\n")
        #         uni_list = df[feature3].unique()
        #         uni_dict = {}
        #         print(uni_list)
        #         for i in range(0, len(uni_list)):
        #             uni_dict[uni_list[i]] = input(f'What is the order of "{uni_list[i]}"?\n')
        #         print(uni_dict)
        #         df[feature3] = df[feature3].map(uni_dict)
        #         norm_ord.remove(feature3)
        #         if norm_ord == []:
        #             flag5 = False

        try:
            for feature in OrdinalEncodingSequence:
                # convert all to string
                df[feature] = df[feature].astype(str)
                
                # uni_list = df[feature].unique()
                # uni_dict = {}
                # print(uni_list)
                # # for i in range(0, len(uni_list)):
                # #     uni_dict[uni_list[i]] = 5
                # print(uni_dict)
                uni_dict = ordinalOrders[feature]
                df[feature] = df[feature].map(uni_dict)
        except:
            return {"message": "Ordinal Encoding Error: wrong input"}
        print("OrdinalEncodingSequence passed")

        
        try:
            filepath = os.path.join('downloads',generateRandomFileName() + ".csv")
            df.to_csv(filepath, sep=',', index=False, encoding='utf-8')
            return filepath
        except:
            return {"message":"File Generating Error. Try again."}
    except:
        return {"message":"uncatched error. Try again."}
