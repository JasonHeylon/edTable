/*      Editable table version 0.1 beta
        Created by Jason Heylon @2014
        jQuery 1.8.2 on dev.
 */

(function ($) {

    $.fn.edTable = function (option, arg) {
        if ($.type(option) == 'string') {
            return $.each(this, function (i, v) {
                init(v, option, arg);
            });
        } else {
            return $.each(this, function (i, v) {
                init(v, option, arg);
            });
        }
    };

    function init(element, option, arg) {
        var opt = $.fn.extend({}, $.fn.edTable.defaults, option);

        var edTable = {
            draw: function () {
                var $table = $("<table></table>").addClass("crmeditable"),
                    $thead = this._getThead(),
                    $tgbleEditBox = $("<div id='editTableEditBox'></div>");
                $table.append($thead);
                $table.append($("<tbody></tbody"));


                this.edTable = {
                    table: $table,
                    theadTr: $table.find("thead tr"),
                    tbody: $table.find("tbody"),
                    editBox: $tgbleEditBox
                };
                this._init();
            },
            _init: function () {
                this._getEditBlock();

                var i = 0,
                    length = opt.columns.length;
                for (; i < length; i++) {
                    var $tr = this._getTRByDataRow(opt.columns[i]);
                    this.edTable.tbody.append($tr);
                }

                $(element).html("").append(this.edTable.table);

                $(element).append(this.edTable.editBox);
                this._bindClickTdForTable();
                this._bindDelClick();
            },

            _getThead: function () {
                var i = 0,
                    headLength = opt.headers.length,
                    $thead = $("<thead></thead>"),
                    $tr = $("<tr></tr>"),
                    dataHead = opt.headers;
                $("<th></th>").html("操作")
                    .addClass("controlColumn")
                    .appendTo($tr);

                for (; i < headLength; i++) {
                    var _currentHead = dataHead[i],
                        _$th = $("<th></th>").addClass("head_" + _currentHead["name"])
                            .html(_currentHead["title"])
                            .attr({
                                "data-name": _currentHead["name"]
                            });
                    _$th.appendTo($tr);
                }

                $tr.appendTo($thead);
                return $thead;
            },

            _getEditBlock: function () {
                var i = 0,
                    headLength = opt.headers.length,
                     dataHead = opt.headers;
                for (; i < headLength; i++) {
                    if (dataHead[i].edit) {
                        var _currentHead = dataHead[i];
                        this.edTable.editBox.append(this._getEditBoxForEachOne(_currentHead));
                    }
                }
            },

            //get each edit box for column
            _getEditBoxForEachOne: function (_currentHead) {
                var $box = $("<div style='display:none;' class='editable_editbox' id='Editable_" + _currentHead.name + "Box'></div>");
                switch (_currentHead.type) {
                    case "text":
                        $box.append("<input type='text' data-type='text'  />");
                        break;
                    case "int":
                        $box.append("<input type='text' data-type='int' />");
                        break;
                    case "float":
                        $box.append("<input type='text' data-type='float' />");
                        break;
                    case "select":
                        $select = $("<select data-type='select'></select>");
                        var i = 0,
                            length = _currentHead.selection.length;
                        for (; i < length; i++) {
                            var currentOption = _currentHead.selection[i];
                            var $option = $("<option></option>").html(currentOption.title).attr({ value: currentOption.value });
                            $option.appendTo($select);
                        }
                        $box.append($select);
                        break;
                    case "crmselect":
                        var $select = $("<select data=type='crmselect'></select>"),
                            crmSeletionList = [], //this._RetrieveAttributefunction(_currentHead.logicName, _currentHead.attribute),
                            i = 0,
                            length = crmSeletionList.length;
                        for (; i < length; i++) {
                            var $option = $("<option></option>").html(crmSeletionList[i].title).attr({ "value": crmSeletionList[i].title });
                            $option.appendTo($select);
                        }

                        $box.append($select);
                        break;
                    case "custom":
                        $box.append("<input type='text' data-type='custom'  />");
                        break;
                    default:
                        $box.append("<input type='text' data-type='text'  />");
                        break;
                }

                return $box;
            },

            //get table row by data column.
            _getTRByDataRow: function (column) {
                var $tr = $("<tr></tr>").attr({ "data-id": column.id }),
                    i = 0,
                    length = opt.headers.length,
                    $delBtn = $("<a href='javascript:;'></a>").addClass("deletebtn"),
                    $controlColumn = $("<td></td>").addClass("rowcontrol");

                $delBtn.append("<img alt='删除' src='" + opt.deleteImg + "' />");
                $controlColumn.append($delBtn);
                $tr.append($controlColumn);// add the control column


                for (; i < length; i++) {
                    var key = opt.headers[i].name,
                        $td = $("<td></td>").attr({ "data-name": opt.headers[i].name, "data-type": opt.headers[i].type }),
                        $innerDiv = $("<div></div>");
                    //console.log(key + " : " + column[key]);
                    //console.log(opt.headers[i].edit);
                    if (opt.headers[i].edit) {
                        $td.addClass("editcolumn");
                    }

                    switch (opt.headers[i].type) {
                        case "select":
                            var selection = { value: "", title: "" }

                            $(opt.headers[i].selection).each(function (i, e) {
                                if (e.value == column[key]) {
                                    selection = e;
                                }
                            });
                            $innerDiv.html(selection.title).attr({ "title": selection.title });
                            $td.attr({ "data-value": selection.value });
                            break;
                        case "custom":
                            $innerDiv.html(column[key].title);
                            var dataAttrs = "";
                            var tdString = "<td ";
                            for (var customeKey in column[key]) {
                                if (customeKey != "title" && customeKey != "value") {
                                    var dataAttr = "data-" + customeKey;
                                    dataAttrs += dataAttr + "='" + column[key][customeKey] + "' ";
                                    tdString += dataAttrs;
                                }
                            }
                            tdString += " ></td>";
                            $td = $(tdString);
                            $td.attr({ "data-value": column[key].value });
                            break;
                        case "float":
                            var value = parseFloat(column[key]).toFixed(2);
                            console.log(value);
                            $innerDiv.html(value).attr({ "title": value });
                            $td.attr({ "data-value": value });
                            break;
                        default:
                            $innerDiv.html(column[key]).attr({ "title": column[key] });
                            $td.attr({ "data-value": column[key] });
                            break;
                    }
                    $innerDiv.appendTo($td);
                    $td.appendTo($tr);
                }

                return $tr;
            },

            //bind double Click to edit column
            _bindClickTdForTable: function () {
                var that = this;
                $(element).find(".crmeditable tbody tr td.editcolumn").live("dblclick", function () {
                    if (that.checkIsHolding()) {
                        return;
                    }
                    if (that._checkIsLock(this)) {
                        return;
                    }
                    var currentOffset = $(this).offset(),
                        $td = $(this),
                        $tr = $(this).parent(),
                        $innerDiv = $(this).find("div"),
                        type = $td.attr("data-type"),
                        dataName = $td.attr("data-name"),
                        $editBox = $(element).find("#Editable_" + dataName + "Box"),
                        innerText = $td.find("div").html(),
                        currentItemID = $tr.attr("data-id");

                    $editBox.css({
                        top: currentOffset.top,
                        left: currentOffset.left,
                        width: this.offsetWidth - 10,
                        height: this.offsetHeight
                    });
                    var dataRow = that._getDataRowByID(currentItemID);
                    console.log(dataRow);

                    $editBox.show();
                    switch (type) {
                        case "text":
                            var $input = $editBox.find("input");
                            $input.val(innerText);
                            $input.unbind();
                            $input.blur(function () {
                                var newValue = $(this).val(),
                                    data = {};
                                data[dataName] = newValue;
                                that.setHolding();
                                dataRow[dataName] = newValue;
                                opt.onValueChange(dataRow, dataName);
                                //that.updateRowByID(currentItemID, data, function () {
                                //    $td.attr({ "data-value": newValue });
                                //    $innerDiv.html(newValue);
                                //    $editBox.hide();
                                //    that.removeHolding();
                                //});

                            });
                            $input.keydown(function (e) {
                                var keycode = (event.keyCode ? event.keyCode : event.which);
                                if (keycode == 13) $input.blur();
                                else if (keycode == 27) { $editBox.hide(); that.removeHolding(); }
                            });
                            $input.focus();

                            break;
                        case "float":
                            var $input = $editBox.find("input");
                            $input.val(innerText);
                            $input.unbind();
                            $input.focus();
                            $input.blur(function () {
                                var newValue = parseFloat($(this).val()).toFixed(2),
                                data = {};
                                if (isNaN(newValue)) {
                                    alert("请输入正确数字!");
                                    $input.focus();
                                    return;
                                }
                               //data[dataName] = { Value: newValue };
                                that.setHolding();
                                dataRow[dataName] = newValue;
                                opt.onValueChange(dataRow, dataName);
                                //that.updateRowByID(currentItemID, data, function () {
                                //    $td.attr({ "data-value": newValue });
                                //    $innerDiv.html(newValue);
                                //    $editBox.hide();
                                //    that.removeHolding();
                                //});

                            });
                            $input.keydown(function (e) {
                                var keycode = (event.keyCode ? event.keyCode : event.which);
                                if (keycode == 13) $input.blur();
                                else if (keycode == 27) { $editBox.hide(); that.removeHolding(); }
                            });
                            $input.focus();
                            break;

                        case "int":
                            var $input = $editBox.find("input");
                            $input.val(innerText);
                            $input.unbind();
                            $input.blur(function () {
                                var newValue = parseInt($(this).val()),
                                data = {};
                                if (isNaN(newValue)) {
                                    alert("请输入正确数字!");
                                    $input.focus();
                                    return;
                                }
                                //data[dataName] = { Value: newValue };
                                that.setHolding();

                                dataRow[dataName] = newValue;
                                opt.onValueChange(dataRow, dataName);
                                //that.updateRowByID(currentItemID, data, function () {
                                //    $td.attr({ "data-value": newValue });
                                //    $innerDiv.html(newValue);
                                //    $editBox.hide();
                                //    that.removeHolding();
                                //});

                            });
                            $input.keydown(function (e) {
                                var keycode = (event.keyCode ? event.keyCode : event.which);
                                if (keycode == 13) $input.blur();
                                else if (keycode == 27) { $editBox.hide(); that.removeHolding(); }
                            });
                            $input.focus();
                            break;

                        case "select":
                            var $select = $editBox.find("select");
                            $select.val($td.attr("data-value"));
                            $select.unbind();
                            that.setHolding();
                            $select.blur(function () {
                                var newValue = $(this).val();
                                var newText = $innerDiv.html($(this).find("option:selected").text());
                                //var data = {};
                                //data[dataName] = { Value: newValue };
                                dataRow[dataName] = newValue;
                                opt.onValueChange(dataRow, dataName);
                                //that.updateRowByID(currentItemID, data, function () {
                                //    $td.attr({ "data-value": newValue });
                                //    $innerDiv.html(newText);
                                //    $editBox.hide();
                                //    that.removeHolding();
                                //});
                            });

                            $select.focus();
                            break;

                        case "crmselect":
                            var $select = $editBox.find("select");
                            $select.val($td.attr("data-value"));
                            $select.unbind();
                            $select.blur(function () {
                                var newValue = $(this).val();
                                var newText = $innerDiv.html($(this).find("option:selected").text());
                                //var data = {};
                                //data[dataName] = { Value: newValue };
                                dataRow[dataName] = newValue;
                                opt.onValueChange(dataRow, dataName);

                                that.updateRowByID(currentItemID, data, function () {
                                    $td.attr({ "data-value": newValue });
                                    $innerDiv.html(newText);
                                    $editBox.hide();
                                    that.removeHolding();
                                });

                            });
                            $select.focus();
                            break;

                        case "custom":
                            var $input = $editBox.find("input");
                            $input.val(innerText);
                            $input.focus();
                            break;

                        default:
                            break;
                    }

                });
            },

            //bind the Delete button click event for saved data.
            _bindDelClick: function () {
                var that = this;

                $(element).find(".crmeditable tbody tr td.rowcontrol a").live("click", function () {
                    if (that.checkIsHolding()) {
                        return;
                    }
                    if (!confirm("确定删除本条数据？")) {
                        return;
                    }
                    var $tr = $(this).parent().parent(),
                        targetId = $tr.attr("data-id");
                    that.setHolding();
                    opt.onDelete(targetId);
                    
                    //that.deleteRowByID(targetId, function () {
                    //    that.removeHolding();
                    //    $tr.remove();
                    //    opt.onDeleted(targetId);
                    //});

                });
            },


            //get the attribute value List by entity logic Name and attribute
            _RetrieveAttributefunction: function (entityLogicName, attributeName) {
                var myList = [];

                var url = document.location.protocol + "//" + document.location.host + "/" + Xrm.Page.context.getOrgUniqueName() + "/XRMServices/2011/Organization.svc/web";
                var requestMain = ""
                requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                requestMain += "  <s:Body>";
                requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
                requestMain += "      <request i:type=\"a:RetrieveAttributeRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
                requestMain += "        <a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
                requestMain += "          <a:KeyValuePairOfstringanyType>";
                requestMain += "            <b:key>MetadataId</b:key>";
                requestMain += "            <b:value i:type=\"c:guid\" xmlns:c=\"http://schemas.microsoft.com/2003/10/Serialization/\">00000000-0000-0000-0000-000000000000</b:value>";
                requestMain += "          </a:KeyValuePairOfstringanyType>";
                requestMain += "          <a:KeyValuePairOfstringanyType>";
                requestMain += "            <b:key>RetrieveAsIfPublished</b:key>";
                requestMain += "            <b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">false</b:value>";
                requestMain += "          </a:KeyValuePairOfstringanyType>";
                requestMain += "          <a:KeyValuePairOfstringanyType>";
                requestMain += "            <b:key>EntityLogicalName</b:key>";
                requestMain += "            <b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + entityLogicName + "</b:value>";
                requestMain += "          </a:KeyValuePairOfstringanyType>";
                requestMain += "          <a:KeyValuePairOfstringanyType>";
                requestMain += "            <b:key>LogicalName</b:key>";
                requestMain += "            <b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + attributeName + "</b:value>";
                requestMain += "          </a:KeyValuePairOfstringanyType>";
                requestMain += "        </a:Parameters>";
                requestMain += "        <a:RequestId i:nil=\"true\" />";
                requestMain += "        <a:RequestName>RetrieveAttribute</a:RequestName>";
                requestMain += "      </request>";
                requestMain += "    </Execute>";
                requestMain += "  </s:Body>";
                requestMain += "</s:Envelope>";


                var req = new XMLHttpRequest();
                req.open("POST", url, false)
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                req.send(requestMain);

                var optionMetaList = $(req.responseText).find("a\\:Results c\\:OptionSet c\\:Options c\\:OptionMetadata");

                for (var i = 0; i < optionMetaList.length; i++) {
                    var title = $(optionMetaList[i]).find("a\\:UserLocalizedLabel a\\:Label").html();
                    var value = $(optionMetaList[i]).find("c\\:Value").html();
                    myList.push(new DropDownSelection(value, title));
                }
                return myList;
            },

            _getDataRowByID: function (id) {
                var rowData={id:id},
                    $tr=$(element).find("tr[data-id="+id+"]");
                for (var key in opt.headers) {
                    var _curretnHeader = opt.headers[key];
                    switch (_curretnHeader.type) {
                        case "select":
                        case "crmselect":
                            rowData[_curretnHeader.name] = $tr.find("td[data-name=" + _curretnHeader.name + "]").attr("data-value");
                            break;
                        case "int":
                            var value = parseInt($tr.find("td[data-name=" + _curretnHeader.name + "]").attr("data-value"));
                            rowData[_curretnHeader.name] = value;
                            break;
                        case "float":
                            var value = parseFloat($tr.find("td[data-name=" + _curretnHeader.name + "]").attr("data-value"));
                            rowData[_curretnHeader.name] = value;
                            break;
                        case "text":
                            var value = $tr.find("td[data-name=" + _curretnHeader.name + "]").attr("data-value");
                                rowData[_curretnHeader.name] = value;
                            break;
                        case "custom":
                            break;
                    }
                }
                return rowData;

            },

            setHolding: function () {
                $(element).attr({ "data-isHolding": "true" });
            },
            removeHolding: function () {
                $(element).removeAttr("data-isHolding");
            },
            checkIsHolding: function () {
                if ($(element).attr("data-isHolding") == "true") { return true; }
                return false;
            },


            showError: function (msg, $targetFocusInput) {
                var message = "数据更新时发生错误，操作失败！";
                edTable.removeHolding();
                if (msg != undefined && typeof (msg) == "string") {
                    message = msg;
                }
                alert(message);
                if ($targetFocusInput) {
                    $targetFocusInput.focus();
                }
            },

            addNewRowForInput: function () {
                var i = 0,
                    headLength = opt.headers.length,
                    dataHead = opt.headers,
                    $newTr = $("<tr></tr>").addClass("newRow"),
                    $tbody = $(element).find(".crmeditable tbody"),
                    $newSaveBtn = $("<a href='javascript:;'><img src='" + opt.saveImg + "' /></a>"),
                    $newDelBtn = $("<a href='javascript:;'><img src='" + opt.deleteImg + "' /></a>"),
                    $newControlTd = $("<td></td>").addClass("newrowcontrol"),
                    that = this;
                if (this.checkIsHolding()) {
                    return;
                }

                $newSaveBtn.click(function () {
                    var rowData = {};
                    for (var key in opt.headers) {
                        var _currentHeader = opt.headers[key];
                        if (_currentHeader.edit) {


                            switch (_currentHeader.type) {
                                case "text":
                                    rowData[_currentHeader.name] = $newTr.find("td[data-name=" + _currentHeader.name + "]").find("input").val();
                                    break;
                                case "custom":
                                    rowData[_currentHeader.name] = $newTr.find("td[data-name=" + _currentHeader.name + "]").find("input").val();
                                    break;
                                case "int":
                                    var newValue = parseInt($newTr.find("td[data-name=" + _currentHeader.name + "]").find("input").val());
                                    if (isNaN(newValue)) { alert("请输入正确数字:" + _currentHeader.title); return; }
                                    rowData[_currentHeader.name] = newValue;
                                    break;
                                case "float":
                                    var newValue = parseFloat($newTr.find("td[data-name=" + _currentHeader.name + "]").find("input").val()).toFixed(2);
                                    if (isNaN(newValue)) { alert("请输入正确数字:" + _currentHeader.title); return; }
                                    rowData[_currentHeader.name] = newValue;
                                    break;
                                case "select":
                                case "crmselect":
                                    var newValue = $newTr.find("td[data-name=" + _currentHeader.name + "]").find("select").val();
                                    rowData[_currentHeader.name] = newValue;
                                    break;
                            }
                        }
                    }
                    opt.onInsert(rowData);

                });
                $newDelBtn.click(function () {
                    $newTr.remove();
                    that.removeHolding();
                });
                $newDelBtn.appendTo($newControlTd);
                $newSaveBtn.appendTo($newControlTd);
                $newControlTd.appendTo($newTr);

                for (; i < headLength; i++) {
                    var _currentHead = dataHead[i],
                     $newTd = $("<td></td>").attr({ "data-name": _currentHead.name });
                    if (dataHead[i].edit) {
                        var $box = this.edTable.editBox.find("#Editable_" + _currentHead.name + "Box");
                        var boxHtml = $box.html();
                        $newTd.append(boxHtml);
                    }
                    $newTr.append($newTd);
                }
                $tbody.append($newTr);
                this.setHolding();
            },
            addNewRowForTable: function (column) {
                var i = 0,
                   $tbody = $(element).find(".crmeditable tbody");
                var $newTR = this._getTRByDataRow(column);
                $tbody.find("tr.newRow").remove();
                $tbody.append($newTR);
               
                this.removeHolding();
            },

            updateDataRow: function (dataRow) {
                if (dataRow == undefined) {
                    this.removeHolding();
                    this.edTable.editBox.find("div").hide();
                    return;
                }
                if (dataRow == false) {
                    this.removeHolding();
                    this.edTable.editBox.find("div").hide();
                    return;
                }
                var $tr = $(element).find(".crmeditable tbody tr[data-id=" + dataRow.id + "]");
                for (var key in opt.headers) {
                    var _currentHeader = opt.headers[key];
                    if (dataRow[_currentHeader.name] == undefined) {
                        continue;
                    }
                    if ( _currentHeader.type == "select") {
                        var $td = $tr.find("td[data-name=" + _currentHeader.name + "]");
                        var title = "";
                        $td.attr({ "data-value": dataRow[_currentHeader.name] });
                        for (var i=0; i <= _currentHeader.selection.length; i++) {
                            if (_currentHeader.selection[i].value == dataRow[_currentHeader.name]) {
                                title = _currentHeader.selection[i].title;
                                i = _currentHeader.selection.length
                            }
                        }
                        $td.find("div").html(title)
                            .attr({ "title": title });
                    }
                    else if(_currentHeader.type == "crmselect"){
                        var $crmSelect = $("#Editable_" + _currentHeader.name + "Box");
                        var $td = $tr.find("td[data-name=" + _currentHeader.name + "]");
                        var title = $crmSelect.find("option[value=" + dataRow[_currentHeader.name] + "]").text();
                        $td.attr({ "data-value": dataRow[_currentHeader.name] });
                        $td.find("div").html(title)
                           .attr({ "title": title });
                    }
                    else if (_currentHeader.type == "float") {
                        var $td = $tr.find("td[data-name=" + _currentHeader.name + "]"),
                            value = parseFloat(dataRow[_currentHeader.name]).toFixed(2);

                        $td.attr({ "data-value": value });
                        $td.find("div").html(value)
                            .attr({ "title": value });
                    }
                    else if (_currentHeader.type == "custom") {
                        //var $td = $tr.find("td[data-name=" + _currentHeader.name + "]");
                        //$td.attr({ "data-value": dataRow[_currentHeader.name] });
                        //$td.find("div").html(dataRow[_currentHeader.name])
                        //    .attr({ "title": dataRow[_currentHeader.name] });
                    }
                    else {
                        var $td = $tr.find("td[data-name=" + _currentHeader.name + "]");
                        $td.attr({ "data-value": dataRow[_currentHeader.name] });
                        $td.find("div").html(dataRow[_currentHeader.name])
                            .attr({ "title": dataRow[_currentHeader.name] });
                    }
                }
                this.edTable.editBox.find("div").hide();

                this.removeHolding();
            },

            deleteDataRow: function (id) {
                var $tr = $(element).find("tr[data-id="+id+"]");
                this.removeHolding();
                $tr.remove();
            },
            setEditForRowColumn:function(id, columnName,flag){
                var $tbody = $(element).find(".crmeditable tbody");
                var $targetColumn= $tbody.find("tr[data-id="+id+"] td[data-name="+columnName+"]");
                $targetColumn.attr({"data-lock":flag});
            },

            _checkIsLock: function (source) {
                if ($(source).attr("data-lock") == "true") return true;
                return false;
            }
        },
        InstanceOp = {
            init: function () {
                if (!(edTable = $(element).data('edTable'))) {
                    return false;
                } else {
                    this.instance = edTable;
                    this.edTable = edTable.edTable;
                }
            },
            addNewRow: function () {
                var instance = this.instance;
                instance.addNewRowForInput();
            },
            addNewDataRow: function (column) {
                var instance = this.instance;
                instance.addNewRowForTable(column);
            },
            updateDataRow: function (column) {
                var instance = this.instance;
                instance.updateDataRow(column);
            },
            deleteDataRow: function (id) {
                var instance = this.instance;
                instance.deleteDataRow(id);
            },
            setEditForRowColumn: function (id, columnName,flag) {
                var instance = this.instance;
                instance.setEditForRowColumn(id, columnName,flag);
            }

        };


        if ($.type(option) == 'string') {
            InstanceOp.init();

            switch (option) {
                case 'addNewRow':
                    InstanceOp.addNewRow();
                    break;
                case 'addNewDataRow':
                    InstanceOp.addNewDataRow(arg);
                    break;
                case 'updateDataRow':
                    InstanceOp.updateDataRow(arg);
                    break;
                case 'deleteDataRow':
                    InstanceOp.deleteDataRow(arg);
                    break;
                case 'lockColumn':
                    InstanceOp.setEditForRowColumn(arg.id,arg.columnName,true);
                    break;
                case 'unlockColumn':
                    InstanceOp.setEditForRowColumn(arg.id, arg.columnName,false);
                    break;
            }
            console.log(option);
        }
        else {
            edTable.draw();
            $(element).data("edTable", edTable);
        }


    }



    $.fn.edTable.defaults = {
        columns: [],
        headers: [],
        entityName: "",
        width: '100%',
        onValueChange: function (rowData, key) {; },
        //onValueChanged: function () {; },

        onDelete: function (id) {; },
        //onDeleted: function (id) {; },

        onInsert: function (rowData) {; },
        //onInserted: function (id) {; },

        deleteImg: 'Content/edTable/img/trash.png',
        saveImg: 'Content/edTable/img/save.png'
    };


}(jQuery));