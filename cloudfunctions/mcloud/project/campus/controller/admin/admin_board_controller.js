/**
 * Notes: 资讯模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');

const AdminBoardService = require('../../service/admin/admin_board_service.js');
const BoardService = require('../../service/board_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');

class AdminBoardController extends BaseProjectAdminController {

	async getAdminBoardDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules); 

		let service = new BoardService();
		return await service.getBoardDetail(input.id);

	}

	async sortBoard() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminBoardService();
		await service.sortBoard(input.id, input.sort);
	}

	async statusBoard() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new BoardService();
		await service.statusBoard(null, input.id, input.status);

	}

	async delBoard() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new BoardService();
		await service.delBoard(null, input.id);

	}

	async getAdminBoardList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminBoardService();
		let result = await service.getAdminBoardList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].BOARD_ADD_TIME = timeUtil.timestamp2Time(list[k].BOARD_ADD_TIME, 'Y-M-D h:m');

			if (list[k].BOARD_OBJ && list[k].BOARD_OBJ.content)
				delete list[k].BOARD_OBJ.content;
		}
		result.list = list;

		return result;

	}

	/************** 用户数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async boardDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminBoardService();

		if (input.isDel === 1)
			await service.deleteBoardDataExcel(); //先删除 

		return await service.getBoardDataURL();
	}

	/** 导出数据 */
	async boardDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			start: 'string|must',
			end: 'string|must',
			status: 'int|must',
			fields: 'array',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminBoardService();
		return await service.exportBoardDataExcel(input);
	}

	/** 删除导出的用户数据 */
	async boardDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminBoardService();
		return await service.deleteBoardDataExcel();
	}
}

module.exports = AdminBoardController;