import pandas as pd
import datetime as dt

prelim_data = pd.read_excel('BoozeVizData.xlsx')

data_build = [prelim_data['Date'], prelim_data['Total Sales']]

headers = ["Date", "Total Sale"]

data = pd.concat(data_build, axis=1, keys=headers)
columns = ["MonthDate", "SalesTotal"]
monthSales = pd.DataFrame(columns=columns)

month_dict = [{"month_str": "April", "month_dt": "2018-04-01"},
              {"month_str": "May", "month_dt": "2018-05-01"},
              {"month_str": "June", "month_dt": "2018-06-01"},
              {"month_str": "July", "month_dt": "2018-07-01"},
              {"month_str": "Aug", "month_dt": "2018-08-01"},
              {"month_str": "Sept", "month_dt": "2018-09-01"},
              {"month_str": "Oct", "month_dt": "2018-10-01"},
              {"month_str": "Nov", "month_dt": "2018-11-01"},
              {"month_str": "Dec", "month_dt": "2018-12-01"},
              {"month_str": "Jan", "month_dt": "2019-01-01"},
              {"month_str": "Feb", "month_dt": "2019-02-01"},
              {"month_str": "March", "month_dt": "2019-03-01"},
              {"month_str": "April", "month_dt": "2019-04-01"},
              {"month_str": "May", "month_dt": "2019-05-01"},
              {"month_str": "June", "month_dt": "2019-06-01"},
              {"month_str": "July", "month_dt": "2019-07-01"},
              {"month_str": "Aug", "month_dt": "2019-08-01"},
              {"month_str": "Sept", "month_dt": "2019-09-01"},
              {"month_str": "Oct", "month_dt": "2019-10-01"},
              {"month_str": "Nov", "month_dt": "2019-11-01"},
              {"month_str": "Dec", "month_dt": "2019-12-01"},
              {"month_str": "Jan", "month_dt": "2020-01-01"},
              {"month_str": "Feb", "month_dt": "2020-02-01"},
              {"month_str": "March", "month_dt": "2020-03-01"},
              {"month_str": "April", "month_dt": "2020-04-01"},
              {"month_str": "May", "month_dt": "2020-05-01"},
              {"month_str": "June", "month_dt": "2020-06-01"},
              {"month_str": "July", "month_dt": "2020-07-01"},
              {"month_str": "Aug", "month_dt": "2020-08-01"},
              {"month_str": "Sept", "month_dt": "2020-09-01"}]

for month in month_dict:
    if month.get('month_dt') == '2019-12-01':
        previous_month = data.loc[data['Date'] == '2019-11-01', 'Total Sale'].sum().round(2)
        month_ahead = data.loc[data['Date'] == '2020-01-01', 'Total Sale'].sum().round(2)
        new_month_sales = ((previous_month + month_ahead)/2)
        new_row = {"Month": month.get('month_str'),
                   "MonthDate": dt.datetime.strptime(month.get('month_dt'), '%Y-%m-%d'),
                   "SalesTotal": new_month_sales}
        monthSales = monthSales.append(new_row, ignore_index=True)
    else:
        new_row = {"Month": month.get('month_str'),
                   "MonthDate": dt.datetime.strptime(month.get('month_dt'), '%Y-%m-%d'),
                   "SalesTotal": data.loc[data['Date'] == month.get('month_dt'), 'Total Sale'].sum().round(2)}
        monthSales = monthSales.append(new_row, ignore_index=True)
        # print(monthSales)

# monthSales['MonthDate'] = dt.date(monthSales['MonthDate'])
monthSales = monthSales[monthSales.SalesTotal != 0]
monthSales.sort_values(["MonthDate"], axis=0, ascending=False, inplace=True)
monthSales.to_csv('MonthSales.csv', sep=',', index=False, date_format='%Y-%m-%d')
print('hello')