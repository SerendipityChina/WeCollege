/**
 * Notes: 兼职模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-23 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const LeaveService = require('../service/leave_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class LeaveController extends BaseProjectController {

	/** 点赞 */
	async likeLeave() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LeaveService();
		return await service.likeLeave(this._userId, input.id);
	}

	/** 获取信息用于编辑修改 */
	async getLeaveDetail() {

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LeaveService();
		let leave = await service.getLeaveDetail(input.id);
		if (leave) {
		}

		return leave;

	}

	/** 浏览详细 */
	async viewLeave() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LeaveService();
		let leave = await service.viewLeave(this._userId, input.id);

		if (leave) {
			leave.LEAVE_ADD_TIME = timeUtil.timestamp2Time(leave.LEAVE_ADD_TIME, 'Y-M-D h:m');

			// 本人是否点赞 
			if (leave.LEAVE_LIKE_LIST
				&& Array.isArray(leave.LEAVE_LIKE_LIST)
				&& leave.LEAVE_LIKE_LIST.includes(this._userId))
				leave.like = true;
			else
				leave.like = false;

			// 删除冗余 
			if (leave.LEAVE_LIKE_LIST) delete leave.LEAVE_LIKE_LIST;
			if (leave.LEAVE_FAV_LIST) delete leave.LEAVE_FAV_LIST;
		}

		return leave;
	}

	/** 状态修改 */
	async statusLeave() {
		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LeaveService();
		return await service.statusLeave(this._userId, input.id, input.status);

	}

	/** 列表与搜索 */
	async getLeaveList() {

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

		let service = new LeaveService();
		let result = await service.getLeaveList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].LEAVE_ADD_TIME = timeUtil.timestamp2Time(list[k].LEAVE_ADD_TIME, 'Y-M-D h:m');

			// 本人是否点赞 
			if (list[k].LEAVE_LIKE_LIST
				&& Array.isArray(list[k].LEAVE_LIKE_LIST)
				&& list[k].LEAVE_LIKE_LIST.includes(this._userId))
				list[k].like = true;
			else
				list[k].like = false;

			// 本人是否收藏
			if (list[k].LEAVE_FAV_LIST
				&& Array.isArray(list[k].LEAVE_FAV_LIST)
				&& list[k].LEAVE_FAV_LIST.includes(this._userId))
				list[k].fav = true;
			else
				list[k].fav = false;

			// 删除冗余
			if (list[k].LEAVE_OBJ.content) delete list[k].LEAVE_OBJ.content;
			if (list[k].LEAVE_LIKE_LIST) delete list[k].LEAVE_LIKE_LIST;
			if (list[k].LEAVE_FAV_LIST) delete list[k].LEAVE_FAV_LIST;
		}

		return result;

	}

	/** 发布 */
	async insertLeave() {

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

		let service = new LeaveService();
		let result = await service.insertLeave(this._userId, input);

		return result;

	}

	/** 修改 */
	async editLeave() {

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

		let service = new LeaveService();
		let result = await service.editLeave(this._userId, input);

		return result;

	}

	/** 更新图片信息 */
	async updateLeaveForms() {

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new LeaveService();
		return await service.updateLeaveForms(input);
	}

	/** 删除 */
	async delLeave() {

		// 数据校验
		let rules = {
			id: 'must|id',
			isAdmin: 'must|bool'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new LeaveService();
		await service.delLeave(this._userId, input.id);

	}

}

module.exports = LeaveController;