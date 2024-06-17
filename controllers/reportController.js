const db = require('../config/db');
const json2csv = require('json2csv').parse;
const excel = require('excel4node');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const fetchAllData = (table, callback) => {
    const query = `SELECT value, timestamp FROM ${table} ORDER BY id ASC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error fetching data from table ${table}:`, err);
            return callback(err);
        }

        if (results.length === 0) {
            console.log(`No data found in ${table} table`);
            return callback(null, []);
        }

        console.log(`Fetched data from ${table} table:`, results);
        callback(null, results);
    });
};

const filterDataByTimeWindow = (data, timeWindow) => {
    if (data.length === 0) return [];

    const endTime = new Date(data[data.length - 1].timestamp);
    let startTime;

    switch (timeWindow) {
        case '1day':
            startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);
            break;
        case '1week':
            startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '1month':
            startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        default:
            return data;
    }

    console.log(`Filtering data from startTime: ${startTime} to endTime: ${endTime}`);
    return data.filter(item => new Date(item.timestamp) >= startTime && new Date(item.timestamp) <= endTime);
};

exports.generateReport = async (req, res) => {
    const { table, timeWindow, format } = req.body;

    if (!table || !timeWindow || !format) {
        console.log('Missing required parameters:', { table, timeWindow, format });
        return res.status(400).send('Missing required parameters');
    }

    console.log('Parameters received:', { table, timeWindow, format });

    fetchAllData(table, (err, data) => {
        if (err) return res.status(500).send('Error fetching data');

        const filteredData = filterDataByTimeWindow(data, timeWindow);

        if (filteredData.length === 0) {
            console.log('No data found for the specified range');
            return res.status(404).send('No data found for the specified range');
        }

        console.log('Filtered data:', filteredData);

        if (format === 'csv') {
            try {
                const csv = json2csv(filteredData);
                res.header('Content-Type', 'text/csv');
                res.attachment(`${table}-report-${Date.now()}.csv`);
                res.send(csv);
            } catch (err) {
                console.error('Error generating CSV:', err);
                res.status(500).send('Error generating CSV');
            }
        } else if (format === 'excel') {
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet('Report');
            const keys = Object.keys(filteredData[0]);

            keys.forEach((key, index) => {
                worksheet.cell(1, index + 1).string(key);
            });

            filteredData.forEach((row, rowIndex) => {
                keys.forEach((key, colIndex) => {
                    worksheet.cell(rowIndex + 2, colIndex + 1).string(String(row[key]));
                });
            });

            const tempFilePath = `./${table}-report-${Date.now()}.xlsx`;
            workbook.write(tempFilePath, (err, stats) => {
                if (err) {
                    console.error('Error generating Excel file:', err);
                    return res.status(500).send('Error generating Excel file');
                }
                res.download(tempFilePath, (err) => {
                    if (err) {
                        console.error('Error sending Excel file:', err);
                    }
                    fs.unlinkSync(tempFilePath);
                });
            });
        } else if (format === 'pdf') {
            const doc = new PDFDocument();
            const tempFilePath = `./${table}-report-${Date.now()}.pdf`;
            doc.pipe(fs.createWriteStream(tempFilePath));

            doc.fontSize(12).text(`Report for ${table}`, {
                align: 'center',
            });

            filteredData.forEach((row, rowIndex) => {
                doc.text(`\nRow ${rowIndex + 1}`);
                Object.keys(row).forEach((key) => {
                    doc.text(`${key}: ${row[key]}`);
                });
            });

            doc.end();
            doc.on('finish', () => {
                res.download(tempFilePath, (err) => {
                    if (err) {
                        console.error('Error sending PDF file:', err);
                    }
                    fs.unlinkSync(tempFilePath);
                });
            });
        } else {
            res.status(400).send('Invalid format');
        }
    });
};
