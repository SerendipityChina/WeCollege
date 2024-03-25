/**
 * Notes: 表白墙模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const BoardService = require('../service/board_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class BoardController extends BaseProjectController {

	/** 点赞 */
	async likeBoard() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new BoardService();
		return await service.likeBoard(this._userId, input.id);
	}

	/** 获取信息用于编辑修改 */
	async getBoardDetail() {

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new BoardService();
		let board = await service.getBoardDetail(input.id);
		if (board) {
		}

		return board;

	}

	/** 浏览详细 */
	async viewBoard() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new BoardService();
		let board = await service.viewBoard(input.id);

		if (board) {
			board.BOARD_ADD_TIME = timeUtil.timestamp2Time(board.BOARD_ADD_TIME, 'Y-M-D h:m');
		}

		return board;
	}

	/** 状态修改 */
	async statusBoard() {  
		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new BoardService();
		return await service.statusBoard(this._userId, input.id, input.status);

	}

	/** 列表与搜索 */
	async getBoardList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new BoardService();
		let result = await service.getBoardList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].BOARD_ADD_TIME = timeUtil.timestamp2Time(list[k].BOARD_ADD_TIME, 'Y-M-D h:m');

			// 本人是否点赞 
			if (list[k].BOARD_LIKE_LIST
				&& Array.isArray(list[k].BOARD_LIKE_LIST)
				&& list[k].BOARD_LIKE_LIST.includes(this._userId))
				list[k].like = true;
			else
				list[k].like = false;

			// 本人是否收藏
			if (list[k].BOARD_FAV_LIST
				&& Array.isArray(list[k].BOARD_FAV_LIST)
				&& list[k].BOARD_FAV_LIST.includes(this._userId))
				list[k].fav = true;
			else
				list[k].fav = false;

			// 删除冗余
			if (list[k].BOARD_OBJ.content) delete list[k].BOARD_OBJ.content;
			if (list[k].BOARD_LIKE_LIST) delete list[k].BOARD_LIKE_LIST;
			if (list[k].BOARD_FAV_LIST) delete list[k].BOARD_FAV_LIST;
		}

		return result;

	}

	/** 发布 */
	async insertBoard() {

		// 数据校验 
		let rules = {
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new BoardService();
		let result = await service.insertBoard(this._userId, input);

		return result;

	}

	/** 修改 */
	async editBoard() {

		// 数据校验 
		let rules = {
			id: 'must|id',
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new BoardService();
		let result = await service.editBoard(this._userId, input);

		return result;

	}

	/** 更新图片信息 */
	async updateBoardForms() {

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new BoardService();
		return await service.updateBoardForms(input);
	}
  
	/** 删除 */
	async delBoard() {

		// 数据校验
		let rules = {
			id: 'must|id',
			isAdmin: 'must|bool'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new BoardService();
		await service.delBoard(this._userId, input.id);

	}

}

module.exports = BoardController;